import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import './Home.css'

export default function Home() {
  const featured = PRODUCTS.slice(0, 3)

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Healing Crystals,<br />Beautiful Bracelets</h1>
            <p>Handcrafted with love. Each bracelet is made from authentic crystals to bring positive energy, balance, and peace into your life.</p>
            <Link to="/shop" className="btn-primary" style={{ display: 'inline-block' }}>
              Shop Now
            </Link>
          </div>
          <div className="hero-visual">
            <div className="hero-crystal">💎</div>
            <div className="hero-crystal secondary">🔮</div>
            <div className="hero-crystal tertiary">✨</div>
          </div>
        </div>
      </section>

      <section className="featured container">
        <h2 className="section-title">Featured Bracelets</h2>
        <p className="section-subtitle">Our most loved healing crystal pieces</p>
        <div className="grid-3">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/shop" className="btn-outline">View All Products</Link>
        </div>
      </section>

      <section className="benefits container">
        <h2 className="section-title">Why ShubhCrystals?</h2>
        <div className="benefits-grid">
          {[
            { icon: '🌿', title: 'Authentic Crystals', desc: 'All crystals are ethically sourced and 100% genuine.' },
            { icon: '🤲', title: 'Handcrafted', desc: 'Each bracelet is handmade with care and intention.' },
            { icon: '🚚', title: 'Pan-India Delivery', desc: 'Fast and secure delivery across India.' },
            { icon: '✨', title: 'Energetically Charged', desc: 'Every piece is cleansed and charged before shipping.' },
          ].map(b => (
            <div key={b.title} className="benefit-card">
              <span className="benefit-icon">{b.icon}</span>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
