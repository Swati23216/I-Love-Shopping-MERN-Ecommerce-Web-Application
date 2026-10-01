const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const {protect, admin} = require('../middleware/auth');

const r = express.Router();
const categories = new Set(['Furniture', 'Home decor', 'Clothes', 'Electronics', 'Beauty products']);
const imageUrlPattern = /^https?:\/\/\S+$/i;

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function productInput(body = {}) {
  body = body || {};
  const {name, description = '', price, category, stock, image = ''} = body;
  if (typeof name !== 'string' || !name.trim() ||
      typeof description !== 'string' ||
      typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
      !categories.has(category) ||
      !Number.isSafeInteger(stock) || stock < 0 ||
      typeof image !== 'string' || (image && !imageUrlPattern.test(image))) {
    return null;
  }

  return {name: name.trim(), description: description.trim(), price, category, stock, image};
}

r.get('/', async (req, res) => {
  const {search = '', category = '', sort = '', limit = '100'} = req.query;
  const searchTerm = typeof search === 'string' ? search.trim().slice(0, 100) : '';
  const categoryFilter = typeof category === 'string' && categories.has(category) ? category : '';
  const requestedLimit = Number.parseInt(limit, 10);
  const pageLimit = Number.isSafeInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 100;
  const query = {};

  if (searchTerm) {
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [{name: new RegExp(escaped, 'i')}, {description: new RegExp(escaped, 'i')}];
  }
  if (categoryFilter) query.category = categoryFilter;

  const ordering = {};
  if (sort === 'price_asc') ordering.price = 1;
  if (sort === 'price_desc') ordering.price = -1;
  if (sort === 'rating') ordering.rating = -1;

  const [products, productCategories] = await Promise.all([
    Product.find(query).sort(ordering).limit(pageLimit),
    Product.distinct('category'),
  ]);
  res.json({products, categories: productCategories});
});

r.get('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({message: 'Invalid product ID.'});
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({message: 'Product not found'});
  res.json(product);
});

r.post('/', protect, admin, async (req, res) => {
  const input = productInput(req.body);
  if (!input) return res.status(400).json({message: 'Provide a name, valid price and stock, one of the five store categories, and a valid image URL.'});
  const product = await Product.create(input);
  res.status(201).json(product);
});

r.put('/:id', protect, admin, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({message: 'Invalid product ID.'});
  const input = productInput(req.body);
  if (!input) return res.status(400).json({message: 'Provide a name, valid price and stock, one of the five store categories, and a valid image URL.'});
  const product = await Product.findByIdAndUpdate(req.params.id, input, {returnDocument: 'after', runValidators: true});
  if (!product) return res.status(404).json({message: 'Product not found'});
  res.json(product);
});

r.delete('/:id', protect, admin, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({message: 'Invalid product ID.'});
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({message: 'Product not found'});
  res.json({message: 'Deleted'});
});

module.exports = r;
