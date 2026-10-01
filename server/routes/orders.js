const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const {protect, admin} = require('../middleware/auth');

const r = express.Router();

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    const error = new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.');
    error.status = 503;
    throw error;
  }
  return {client: new Razorpay({key_id: keyId, key_secret: keySecret}), keyId, keySecret};
}

function validateAddress(address) {
  const fields = ['address', 'city', 'state', 'postalCode', 'phone'];
  if (!address || fields.some(field => typeof address[field] !== 'string' || !address[field].trim())) {
    const error = new Error('Complete all shipping address fields before continuing.');
    error.status = 400;
    throw error;
  }
  return Object.fromEntries(fields.map(field => [field, address[field].trim()]));
}

function normalizeCart(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Your cart is empty.');
    error.status = 400;
    throw error;
  }

  const normalized = items.map(item => {
    if (!item || typeof item !== 'object') {
      const error = new Error('Your cart contains an invalid product or quantity.');
      error.status = 400;
      throw error;
    }
    const id = String(item.product || '');
    const qty = Number(item.qty);
    if (!mongoose.Types.ObjectId.isValid(id) || !Number.isSafeInteger(qty) || qty < 1) {
      const error = new Error('Your cart contains an invalid product or quantity.');
      error.status = 400;
      throw error;
    }
    return {product: id, qty};
  });

  if (new Set(normalized.map(item => item.product)).size !== normalized.length) {
    const error = new Error('Your cart contains a duplicate product.');
    error.status = 400;
    throw error;
  }
  return normalized;
}

function addressDigest(address) {
  return crypto.createHash('sha256').update(JSON.stringify(address)).digest('hex');
}

r.post('/razorpay/order', protect, async (req, res) => {
  try {
    const {client, keyId} = getRazorpay();
    const cart = normalizeCart(req.body.items);
    const shippingAddress = validateAddress(req.body.shippingAddress);
    const products = await Product.find({_id: {$in: cart.map(item => item.product)}});
    const productsById = new Map(products.map(product => [String(product._id), product]));
    let amount = 0;
    const capturedItems = [];

    for (const item of cart) {
      const product = productsById.get(item.product);
      if (!product) return res.status(400).json({message: 'A product in your cart is no longer available.'});
      if (product.stock < item.qty) {
        return res.status(409).json({message: `There is not enough stock for ${product.name}.`});
      }
      const unitAmount = Math.round(product.price * 100);
      amount += unitAmount * item.qty;
      capturedItems.push([item.product, item.qty, unitAmount]);
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({message: 'The order total must be greater than zero.'});
    }

    const cartNote = JSON.stringify(capturedItems);
    if (cartNote.length > 256) {
      return res.status(400).json({message: 'Please reduce the number of different products in your cart before checkout.'});
    }

    const paymentOrder = await client.orders.create({
      amount,
      currency: 'INR',
      receipt: `ils_${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        cart: cartNote,
        addressDigest: addressDigest(shippingAddress),
      },
    });

    res.status(201).json({
      keyId,
      orderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
    });
  } catch (error) {
    console.error('Could not create Razorpay order:', error);
    res.status(error.status || 502).json({message: error.status ? error.message : 'Could not start secure checkout. Please try again.'});
  }
});

r.post('/razorpay/verify', protect, async (req, res) => {
  const {razorpay_order_id: paymentOrderId, razorpay_payment_id: paymentId, razorpay_signature: signature} = req.body;
  let updatedStock = [];

  try {
    if (![paymentOrderId, paymentId, signature].every(value => typeof value === 'string' && value.length > 0)) {
      return res.status(400).json({message: 'Payment verification details are incomplete.'});
    }

    const {client, keySecret} = getRazorpay();
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${paymentOrderId}|${paymentId}`)
      .digest('hex');
    const provided = Buffer.from(signature, 'hex');
    const expected = Buffer.from(expectedSignature, 'hex');
    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
      return res.status(400).json({message: 'Payment signature could not be verified.'});
    }

    const existing = await Order.findOne({razorpayPaymentId: paymentId});
    if (existing) {
      if (String(existing.user) !== String(req.user._id)) {
        return res.status(403).json({message: 'This payment belongs to another account.'});
      }
      return res.json(existing);
    }

    const paymentOrder = await client.orders.fetch(paymentOrderId);
    if (paymentOrder.notes?.userId !== String(req.user._id)) {
      return res.status(403).json({message: 'This checkout belongs to another account.'});
    }
    const shippingAddress = validateAddress(req.body.shippingAddress);
    if (paymentOrder.notes.addressDigest !== addressDigest(shippingAddress)) {
      return res.status(400).json({message: 'The shipping address changed during checkout. Please start checkout again.'});
    }

    let capturedItems;
    try {
      capturedItems = JSON.parse(paymentOrder.notes.cart);
    } catch {
      return res.status(400).json({message: 'The checkout details could not be verified. Please start again.'});
    }
    if (!Array.isArray(capturedItems) || !capturedItems.length) {
      return res.status(400).json({message: 'The checkout details could not be verified. Please start again.'});
    }
    const amount = capturedItems.reduce((sum, item) => {
      if (!Array.isArray(item) || item.length !== 3 || !mongoose.Types.ObjectId.isValid(item[0]) ||
          !Number.isSafeInteger(item[1]) || item[1] < 1 ||
          !Number.isSafeInteger(item[2]) || item[2] < 0) return NaN;
      return sum + item[2] * item[1];
    }, 0);
    if (!Number.isSafeInteger(amount) || amount !== paymentOrder.amount || paymentOrder.currency !== 'INR') {
      return res.status(400).json({message: 'The paid amount does not match this checkout.'});
    }

    const products = await Product.find({_id: {$in: capturedItems.map(item => item.product)}});
    const productsById = new Map(products.map(product => [String(product._id), product]));
    if (capturedItems.some(item => !productsById.has(item[0]))) {
      return res.status(409).json({message: 'A paid product is no longer available. Please contact support.'});
    }
    const orderItems = [];

    for (const [productId, qty, price] of capturedItems) {
      const product = productsById.get(productId);
      const result = await Product.updateOne(
        {_id: product._id, stock: {$gte: qty}},
        {$inc: {stock: -qty}},
      );
      if (result.modifiedCount !== 1) {
        const error = new Error(`There is not enough stock for ${product.name} to complete this order.`);
        error.status = 409;
        throw error;
      }
      updatedStock.push({product: product._id, qty});
      orderItems.push({
        product: product._id,
        name: product.name,
        price: price / 100,
        qty,
        image: product.image,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      razorpayOrderId: paymentOrderId,
      razorpayPaymentId: paymentId,
      total: amount / 100,
    });

    res.status(201).json(order);
  } catch (error) {
    if (updatedStock.length) {
      await Promise.all(updatedStock.map(item =>
        Product.updateOne({_id: item.product}, {$inc: {stock: item.qty}}),
      )).catch(rollbackError => console.error('Could not restore stock after payment verification failure:', rollbackError));
    }
    if (error.code === 11000) {
      const existing = await Order.findOne({razorpayPaymentId: paymentId});
      if (existing && String(existing.user) === String(req.user._id)) return res.json(existing);
    }
    console.error('Could not verify Razorpay payment:', error);
    res.status(error.status || 502).json({message: error.status ? error.message : 'Payment was received but the order could not be confirmed. Please contact support.'});
  }
});

r.get('/my', protect, async (req, res) => res.json(await Order.find({user: req.user._id}).sort('-createdAt')));
r.get('/', protect, admin, async (req, res) => res.json(await Order.find().populate('user', 'name email').sort('-createdAt')));
r.get('/:id', protect, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({message: 'Invalid order ID.'});
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({message: 'Order not found'});
  if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
    return res.status(403).json({message: 'Forbidden'});
  }
  res.json(order);
});
r.put('/:id/status', protect, admin, async (req, res) => {
  const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({message: 'Invalid order ID.'});
  }
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({message: 'Invalid order status.'});
  }
  const order = await Order.findByIdAndUpdate(req.params.id, {status: req.body.status}, {returnDocument: 'after', runValidators: true});
  if (!order) return res.status(404).json({message: 'Order not found'});
  res.json(order);
});

module.exports = r;
