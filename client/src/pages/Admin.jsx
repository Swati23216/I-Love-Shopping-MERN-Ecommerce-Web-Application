import {useEffect, useState} from 'react';
import api from '../services/api';
import {categories} from '../constants/categories';

const emptyForm = {name: '', description: '', price: '', category: '', stock: '', image: ''};

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [statsResponse, productsResponse, ordersResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/products?limit=100'),
        api.get('/orders'),
      ]);
      setStats(statsResponse.data);
      setProducts(productsResponse.data.products);
      setOrders(ordersResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load the dashboard. Please refresh and try again.');
    }
  };

  useEffect(() => { load(); }, []);

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = {...form, price: Number(form.price), stock: Number(form.stock)};
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save this product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const edit = product => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '',
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const remove = async id => {
    if (!window.confirm('Delete this product?')) return;
    setError('');
    try {
      await api.delete(`/products/${id}`);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this product. Please try again.');
    }
  };

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.put(`/orders/${id}/status`, {status});
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this order. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <section className="section admin-page">
      <div className="admin-heading"><div><p className="eyebrow">YOUR LITTLE CONTROL ROOM</p><h1>Store dashboard</h1></div><span>All the good stuff, in one place.</span></div>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="stats">
        {[['Revenue', `₹${(stats?.revenue || 0).toLocaleString('en-IN')}`], ['Orders', stats?.orders || 0], ['Products', stats?.products || 0], ['Customers', stats?.customers || 0]].map(([label, value]) => (
          <div className="stat" key={label}><span>{label}</span><b>{value}</b><small>Store {label.toLowerCase()}</small></div>
        ))}
      </div>
      <div className="admincols">
        <form className="panel admin-form" onSubmit={save}>
          <div className="panel-heading"><div><p className="eyebrow">{editingId ? 'MAKE A LITTLE CHANGE' : 'ADD SOMETHING LOVELY'}</p><h2>{editingId ? 'Edit product' : 'New product'}</h2></div>{editingId && <button type="button" className="cancel-button" onClick={cancelEdit}>Cancel</button>}</div>
          <label>Product name<input required value={form.name} onChange={event => setForm({...form, name: event.target.value})} placeholder="e.g. Woven Weekend Tote" /></label>
          <label>Description<textarea rows="3" value={form.description} onChange={event => setForm({...form, description: event.target.value})} placeholder="What makes this one special?" /></label>
          <div className="admin-form-row">
            <label>Price (₹)<input type="number" min="0" step="0.01" required value={form.price} onChange={event => setForm({...form, price: event.target.value})} placeholder="0.00" /></label>
            <label>Stock<input type="number" min="0" step="1" required value={form.stock} onChange={event => setForm({...form, stock: event.target.value})} placeholder="0" /></label>
          </div>
          <label>Collection<select required value={form.category} onChange={event => setForm({...form, category: event.target.value})}><option value="">Choose a collection</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
          <label>Product image URL<input type="url" value={form.image} onChange={event => setForm({...form, image: event.target.value})} placeholder="https://…" /></label>
          <button className="btn auth-submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'} <span aria-hidden="true">↗</span></button>
        </form>
        <div className="panel admin-product-panel">
          <div className="panel-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h2>Products</h2></div><span className="muted">{products.length} listed</span></div>
          {products.length ? products.map(product => (
            <div className="adminrow" key={product._id}>
              <span className="admin-product-name"><b>{product.name}</b><small>{product.category} · {product.stock} in stock</small></span>
              <span className="admin-product-price">₹{product.price.toLocaleString('en-IN')}</span>
              <div className="row-actions"><button onClick={() => edit(product)}>Edit</button><button className="delete-action" onClick={() => remove(product._id)}>Delete</button></div>
            </div>
          )) : <p className="admin-empty">Your collection is waiting for its first find.</p>}
        </div>
      </div>
      <div className="panel orders-panel">
        <div className="panel-heading"><div><p className="eyebrow">OUT IN THE WORLD</p><h2>Recent orders</h2></div><span className="muted">Update fulfilment as you go</span></div>
        {orders.length ? orders.map(order => (
          <div className="adminrow" key={order._id}>
            <span><b>Order #{order._id.slice(-8)}</b><small>{order.user?.name || 'Customer'} · {order.paymentMethod || 'Razorpay'} · ₹{order.total.toLocaleString('en-IN')}</small></span>
            <select aria-label={`Status for order ${order._id}`} value={order.status} onChange={event => updateStatus(order._id, event.target.value)}>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => <option key={status}>{status}</option>)}</select>
          </div>
        )) : <p className="admin-empty">Your first order will show up here.</p>}
      </div>
    </section>
  );
}
