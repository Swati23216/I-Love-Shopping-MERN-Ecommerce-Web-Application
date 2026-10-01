import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import {categories} from '../constants/categories';

const categoryArt = {
  Furniture: {icon: '⌂', image: 'photo-1616486338812-3dadae4b4ace'},
  'Home decor': {icon: '✿', image: 'photo-1600210492486-724fe5c67fb0'},
  Clothes: {icon: '✳', image: 'photo-1483985988355-763728e1935b'},
  Electronics: {icon: '⌁', image: 'photo-1498049794561-7780e7231661'},
  'Beauty products': {icon: '✧', image: 'photo-1596462502278-27bfdc403348'},
};

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?limit=4')
      .then(response => setProducts(response.data.products))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="home-page">
      <section className="hero hero-home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> LITTLE FINDS. BIG FEELINGS.</p>
          <h1>Find a little<br />more <em>lovely.</em></h1>
          <p className="hero-description">For your home, your wardrobe, and all the in-between. Meet the things that make everyday feel special.</p>
          <div className="hero-actions">
            <Link className="btn hero-button" to="/categories">Explore the edit <span aria-hidden="true">↗</span></Link>
            <span className="hero-note"><span aria-hidden="true">♡</span> Curated with love, always</span>
          </div>
          <div className="hero-proof"><span className="proof-stars">★★★★★</span><span>Good finds, happy homes.</span></div>
        </div>
        <div className="hero-film">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            controls
            poster="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
            aria-label="A little look at the things you can discover at I Love Shopping"
          >
            <source src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          <div className="film-caption"><span className="film-play">▶</span><span><small>THE I LOVE SHOPPING EDIT</small><b>A little joy in every find</b></span></div>
          <span className="film-stamp">MADE TO<br />MAKE YOU<br /><i>SMILE</i></span>
        </div>
        <span className="hero-scribble" aria-hidden="true">♡</span>
      </section>

      <section className="section home-categories">
        <div className="sectionhead">
          <div><p className="eyebrow">A GOOD PLACE TO START</p><h2>What are you in the mood for?</h2></div>
          <Link className="text-link" to="/categories">See all collections <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="home-category-grid">
          {categories.map(category => {
            const art = categoryArt[category];
            return (
              <Link className="home-category-card" key={category} to={`/products?category=${encodeURIComponent(category)}`}>
                <img src={`https://images.unsplash.com/${art.image}?auto=format&fit=crop&w=680&q=80`} alt="" loading="lazy" />
                <span className="category-icon" aria-hidden="true">{art.icon}</span>
                <span className="category-card-name">{category}<span aria-hidden="true">↗</span></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section featured-section">
        <div className="sectionhead">
          <div><p className="eyebrow">THE CROWD PLEASERS</p><h2>A few things we love</h2></div>
          <Link className="text-link" to="/products">Shop everything <span aria-hidden="true">↗</span></Link>
        </div>
        {products.length ? (
          <div className="grid">{products.map(product => <ProductCard key={product._id} product={product} />)}</div>
        ) : (
          <div className="curation-note"><span aria-hidden="true">✳</span><p>Our shelves are getting ready. Check back soon for lovely new finds.</p></div>
        )}
      </section>

      <section className="home-note">
        <span className="note-flower" aria-hidden="true">✿</span>
        <p className="eyebrow">A SHOP WITH A SOFTER SIDE</p>
        <h2>Little things can<br /><em>make your day.</em></h2>
        <Link className="text-link" to="/about">Get to know us <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
