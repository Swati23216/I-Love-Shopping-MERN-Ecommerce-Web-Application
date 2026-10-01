import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({name: '', email: '', password: ''});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {register} = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/login?registered=1', {replace: true});
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth auth-page">
      <div className="auth-aside">
        <p className="eyebrow">A LITTLE JOY, DELIVERED</p>
        <h1>Good things are just around the corner.</h1>
        <p>Create an account to discover pieces you’ll love for every part of life.</p>
      </div>
      <form className="panel auth-panel" onSubmit={submit}>
        <span className="auth-step">YOUR SHOPPING STORY STARTS HERE</span>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Join us for considered finds and a more joyful way to shop.</p>
        {error && <div className="error" role="alert">{error}</div>}
        <label>Full name<input autoComplete="name" placeholder="Your name" required value={form.name} onChange={event => setForm({...form, name: event.target.value})} /></label>
        <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={event => setForm({...form, email: event.target.value})} /></label>
        <label>Password<input type="password" autoComplete="new-password" placeholder="At least 6 characters" minLength="6" required value={form.password} onChange={event => setForm({...form, password: event.target.value})} /></label>
        <button className="btn auth-submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'} <span aria-hidden="true">↗</span></button>
        <p className="auth-foot">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </section>
  );
}