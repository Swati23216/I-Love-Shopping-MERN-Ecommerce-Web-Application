import {Link} from 'react-router-dom';

const services = [
  ['01', 'Thoughtful collections', 'Explore five easy-to-browse collections, brought together to make finding just the right thing feel effortless.'],
  ['02', 'A lovely little bag', 'Save your favorites as you browse, update quantities, and see your order total before checkout.'],
  ['03', 'Secure online checkout', 'Pay securely with Razorpay. Your order is created only after your payment has been verified.'],
  ['04', 'Orders, all in one place', 'See your purchases and follow each order’s fulfilment status from your account.'],
];

export default function Services() {
  return (
    <section className="section editorial-page services-page">
      <div className="editorial-kicker"><span>THE NICE LITTLE EXTRAS</span><span>MADE TO MAKE IT EASY</span></div>
      <div className="services-heading"><p className="eyebrow">A LITTLE HELP ALONG THE WAY</p><h1>Here for the whole<br /><em>happy experience.</em></h1></div>
      <div className="services-list">
        {services.map(([number, title, description]) => (
          <article className="service-row" key={number}>
            <span>{number}</span><div><h2>{title}</h2><p>{description}</p></div><span className="service-sparkle" aria-hidden="true">✳</span>
          </article>
        ))}
      </div>
      <div className="services-cta"><p>Ready to find your thing?</p><Link className="btn hero-button" to="/categories">Explore the collections <span aria-hidden="true">↗</span></Link></div>
    </section>
  );
}
