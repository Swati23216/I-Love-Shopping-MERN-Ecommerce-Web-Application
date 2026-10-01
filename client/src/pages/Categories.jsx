import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../services/api';
import {categories} from '../constants/categories';

const categoryDetails = {
  Furniture: ['01', 'photo-1616486338812-3dadae4b4ace', 'Pieces to make your place feel like you.'],
  'Home decor': ['02', 'photo-1600210492486-724fe5c67fb0', 'Finishing touches for your favorite corners.'],
  Clothes: ['03', 'photo-1483985988355-763728e1935b', 'Everyday favorites, with a little extra something.'],
  Electronics: ['04', 'photo-1498049794561-7780e7231661', 'Clever little upgrades for the way you live.'],
  'Beauty products': ['05', 'photo-1596462502278-27bfdc403348', 'Feel-good essentials for your everyday ritual.'],
};

export default function Categories() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?limit=100')
      .then(response => setProducts(response.data.products))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="section categories-page">
      <div className="category-intro">
        <p className="eyebrow">FIND YOUR KIND OF LOVELY</p>
        <h1>Good things,<br /><em>by category.</em></h1>
        <p>From the little details at home to the things you take everywhere, there’s something here for every kind of day.</p>
      </div>
      <div className="category-gallery">
        {categories.map(category => {
          const [number, image, description] = categoryDetails[category];
          const count = products.filter(product => product.category === category).length;
          return (
            <Link className="category-feature" key={category} to={`/products?category=${encodeURIComponent(category)}`}>
              <img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=1000&q=85`} alt="" loading="lazy" />
              <span className="category-number">{number} / 05</span>
              <span className="category-feature-info">
                <span><small>{count} {count === 1 ? 'lovely find' : 'lovely finds'}</small><b>{category}</b><span>{description}</span></span>
                <span className="category-arrow" aria-hidden="true">↗</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
