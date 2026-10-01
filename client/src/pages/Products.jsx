import {useEffect,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import {categories as featuredCategories} from '../constants/categories';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({products: [], categories: []});
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');

  useEffect(() => {
    api.get('/products', {params: {search: query, category, sort}})
      .then(response => setData(response.data))
      .catch(() => setData(current => ({...current, products: []})));
  }, [query, category, sort]);

  const chooseCategory = event => {
    const value = event.target.value;
    setCategory(value);
    value ? setSearchParams({category: value}) : setSearchParams({});
  };
  const availableCategories = [...new Set([...featuredCategories, ...data.categories])];

  return (
    <section className="section products-page">
      <div className="sectionhead">
        <div><p className="eyebrow">THE GOOD STUFF</p><h1>{category || 'A little bit of everything'}</h1></div>
        <span className="result-count">{data.products.length} lovely finds</span>
      </div>
      <div className="filters">
        <input aria-label="Search products" placeholder="What are you looking for?" value={query} onChange={event => setQuery(event.target.value)} />
        <select aria-label="Filter by category" value={category} onChange={chooseCategory}><option value="">All collections</option>{availableCategories.map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)}><option value="">Sort by</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="rating">Top rated</option></select>
      </div>
      {data.products.length ? <div className="grid">{data.products.map(product => <ProductCard key={product._id} product={product} />)}</div> : <div className="empty"><span aria-hidden="true">✿</span><h2>No finds just yet</h2><p>Try another search or collection. We’re always adding lovely new things.</p></div>}
    </section>
  );
}