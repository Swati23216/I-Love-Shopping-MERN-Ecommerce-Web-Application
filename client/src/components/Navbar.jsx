import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';

export default function Navbar() {
  const {user, logout} = useAuth();
  const {cart, clearCart} = useCart();
  const nav = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const signOut = () => {
    logout();
    clearCart();
    nav('/login', {replace: true});
  };

  return (
    <header className="site-header">
      <div className="nav">
        <Link className="brand" to={user ? '/' : '/login'} aria-label="I Love Shopping home">
          <img className="brand-logo" src="/i-love-shopping-icon-21597056.webp" alt="" />
        </Link>
        {user ? (
          <>
            <nav aria-label="Main navigation">
              <Link to="/categories"><span aria-hidden="true">▦</span> Categories</Link>
              <Link to="/services"><span aria-hidden="true">✦</span> Services</Link>
              <Link to="/about"><span aria-hidden="true">♡</span> About</Link>
              <Link to="/orders">Orders</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            </nav>
            <div className="navright">
              <Link className="cart-link" to="/cart" aria-label={`Shopping bag, ${itemCount} items`}>
                <span aria-hidden="true">♧</span><span>Bag</span><small>{itemCount}</small>
              </Link>
              <span className="welcome">Hi, {user.name.split(' ')[0]}</span>
              <button className="logout-button" onClick={signOut}><span aria-hidden="true">↗</span> Logout</button>
            </div>
          </>
        ) : (
          <div className="navright guest-nav">
            <Link to="/login">Log in</Link>
            <Link className="nav-signup" to="/register">Create account <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </div>
    </header>
  );
}