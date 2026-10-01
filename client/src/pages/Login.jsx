import {useState} from 'react';
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({email: '', password: ''});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const {login} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/', {replace: true});
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not sign you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth auth-page">
      <div className="auth-aside login-aside">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Your next favorite thing is waiting.</h1>
        <p>Sign in to pick up where you left off and find something lovely.</p>
      </div>
      <form className="panel auth-panel" onSubmit={submit}>
        <span className="auth-step">YOUR HAPPY PLACE, JUST A CLICK AWAY</span>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to your I Love Shopping account.</p>
        {searchParams.get('registered') && <div className="success" role="status">Account created! Please log in to continue.</div>}
        {error && <div className="error" role="alert">{error}</div>}
        <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={event => setForm({...form, email: event.target.value})} /></label>
        <label>Password<input type="password" autoComplete="current-password" placeholder="Your password" required value={form.password} onChange={event => setForm({...form, password: event.target.value})} /></label>
        <button className="btn auth-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Log in'} <span aria-hidden="true">↗</span></button>
        <p className="auth-foot">New to the good stuff? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}