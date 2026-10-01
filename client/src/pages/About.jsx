import {Link} from 'react-router-dom';

export default function About() {
  return (
    <section className="section editorial-page about-page">
      <div className="editorial-kicker"><span>OUR LITTLE CORNER OF THE INTERNET</span><span>EST. WITH LOVE · 2026</span></div>
      <div className="editorial-intro">
        <p className="eyebrow">HELLO, WE’RE I LOVE SHOPPING</p>
        <h1>Shopping should feel like finding <em>your thing.</em></h1>
        <p>We believe the everyday deserves a little delight. So we bring together thoughtful pieces for your home, your style, and all the moments in between—easy to find, lovely to keep.</p>
        <Link className="btn hero-button" to="/categories">Find your next favorite <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="about-manifesto">
        <div className="manifesto-art"><span>♡</span><small>A LITTLE<br />MORE LOVELY</small></div>
        <div className="about-points">
          <article><span>01 — THE EDIT</span><h2>Chosen with care.</h2><p>A considered mix of lovely, useful things, across the categories you care about.</p></article>
          <article><span>02 — THE FEELING</span><h2>Everyday, elevated.</h2><p>We’re here for the pieces that make home warmer and getting ready a little more fun.</p></article>
          <article><span>03 — THE PROMISE</span><h2>Shopping made simple.</h2><p>Clear choices, a smooth checkout, and your orders all in one easy place.</p></article>
        </div>
      </div>
    </section>
  );
}
