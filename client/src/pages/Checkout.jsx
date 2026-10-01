import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Secure checkout could not be loaded. Check your connection and try again.'));
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const {cart, total, clearCart} = useCart();
  const {user} = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({address: '', city: '', state: '', postalCode: '', phone: ''});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = event => setForm(current => ({...current, [event.target.name]: event.target.value}));

  const submit = async event => {
    event.preventDefault();
    if (!cart.length) {
      setError('Your cart is empty. Add something lovely before checking out.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const {data: paymentOrder} = await api.post('/orders/razorpay/order', {
        items: cart.map(item => ({product: item.product, qty: item.qty})),
        shippingAddress: form,
      });
      await loadRazorpay();

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'I Love Shopping',
        description: 'A little joy in every find',
        order_id: paymentOrder.orderId,
        prefill: {name: user.name, email: user.email, contact: form.phone},
        theme: {color: '#375c4d'},
        modal: {ondismiss: () => setSubmitting(false)},
        handler: async payment => {
          try {
            const {data: order} = await api.post('/orders/razorpay/verify', {
              ...payment,
              shippingAddress: form,
            });
            clearCart();
            navigate(`/orders/${order._id}`, {replace: true});
          } catch (verificationError) {
            setError(verificationError.response?.data?.message || 'We could not confirm your payment. Please contact support before trying again.');
            setSubmitting(false);
          }
        },
      });

      checkout.on('payment.failed', event => {
        setError(event.error?.description || 'Your payment could not be completed. Please try again.');
        setSubmitting(false);
      });
      checkout.open();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'We could not start checkout. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <section className="section checkout-page">
      <div className="checkout-heading"><p className="eyebrow">ALMOST YOURS</p><h1>Let’s make it official.</h1><p>Your finds are one secure payment away.</p></div>
      <div className="checkout-layout">
        <form className="panel checkout-form" onSubmit={submit}>
          <div className="checkout-section-title"><span>01</span><div><h2>Where should we send it?</h2><p>We’ll use these details for delivery.</p></div></div>
          {error && <div className="error" role="alert">{error}</div>}
          <label className="field-wide">Street address<input name="address" autoComplete="street-address" placeholder="House number and street" required value={form.address} onChange={updateField} /></label>
          <label>City<input name="city" autoComplete="address-level2" placeholder="City" required value={form.city} onChange={updateField} /></label>
          <label>State<input name="state" autoComplete="address-level1" placeholder="State" required value={form.state} onChange={updateField} /></label>
          <label>PIN code<input name="postalCode" autoComplete="postal-code" inputMode="numeric" placeholder="PIN code" required value={form.postalCode} onChange={updateField} /></label>
          <label>Phone number<input name="phone" autoComplete="tel" type="tel" placeholder="For delivery updates" required value={form.phone} onChange={updateField} /></label>
          <button className="btn auth-submit" disabled={submitting}>{submitting ? 'Opening secure checkout…' : 'Pay securely with Razorpay'} <span aria-hidden="true">↗</span></button>
          <p className="secure-note"><span aria-hidden="true">⌑</span> Secure payment · Your order is confirmed only after payment verification.</p>
        </form>
        <aside className="panel checkout-summary">
          <p className="eyebrow">IN YOUR BAG</p>
          {cart.map(item => (
            <div className="checkout-item" key={item.product}>
              <img src={item.image || 'https://placehold.co/120x120?text=Find'} alt="" />
              <span><b>{item.name}</b><small>Qty {item.qty}</small></span>
              <strong>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
            </div>
          ))}
          <div className="checkout-total"><span>Total</span><b>₹{total.toLocaleString('en-IN')}</b></div>
          <p className="checkout-payment-copy">Final pricing and stock are checked securely before payment.</p>
        </aside>
      </div>
    </section>
  );
}
