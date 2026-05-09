import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import { useProducts } from '../hooks/useProducts'
import './Home.css'

const CRYSTALS = [
  { stone: 'Amethyst',        emoji: '💜', desc: 'Calm & clarity' },
  { stone: 'Rose Quartz',     emoji: '🌸', desc: 'Love & healing' },
  { stone: 'Clear Quartz',    emoji: '🔮', desc: 'Energy & focus' },
  { stone: 'Black Tourmaline',emoji: '🖤', desc: 'Protection' },
  { stone: 'Citrine',         emoji: '💛', desc: 'Abundance' },
  { stone: 'Lapis Lazuli',    emoji: '💙', desc: 'Wisdom' },
]

const BENEFITS = [
  { icon: '🌿', title: 'Authentic Crystals',    desc: 'Ethically sourced, 100% genuine stones. No fakes, no dyes.' },
  { icon: '🤲', title: 'Handcrafted with Love', desc: 'Each bracelet strung by hand with care and positive intention.' },
  { icon: '🚚', title: 'Pan-India Delivery',    desc: 'Fast, secure delivery. Free shipping on orders above ₹999.' },
  { icon: '✨', title: 'Energetically Charged', desc: 'Every piece is cleansed with sound and moonlight before shipping.' },
]

const TESTIMONIALS = [
  {
    name: 'Priya S.', location: 'Mumbai', crystal: 'Amethyst', emoji: '💜',
    text: 'The Amethyst bracelet has been my companion for 3 months now. My sleep improved noticeably and I feel so much calmer at work. Worth every rupee!',
    stars: 5,
  },
  {
    name: 'Anjali M.', location: 'Bangalore', crystal: 'Rose Quartz', emoji: '🌸',
    text: 'Absolutely beautiful quality. The packaging was gorgeous and the bracelet looks even prettier in person. Already ordered two more for my sisters!',
    stars: 5,
  },
  {
    name: 'Deepika R.', location: 'Delhi', crystal: 'Citrine', emoji: '💛',
    text: 'Arrived within 3 days, packed so lovingly. I wear my Citrine every day and people keep asking where I got it. Highly recommend!',
    stars: 5,
  },
]

const TRUST_STRIP = [
  { icon: '🌿', text: '100% Authentic Crystals' },
  { icon: '🤲', text: 'Handcrafted in India' },
  { icon: '🚚', text: 'Free Shipping ₹999+' },
  { icon: '✨', text: 'Energy Charged' },
  { icon: '↩️', text: '7-Day Returns' },
  { icon: '🔒', text: 'Secure Payments' },
]

export default function Home() {
  const { products, loading, error } = useProducts()
  const featured = products.slice(0, 3)

  return (
    <div className="home">

      {/* ── Announcement bar ── */}
      <div className="home-announce">
        🎁 Free shipping on orders above ₹999 &nbsp;·&nbsp; ✨ Handcrafted &amp; energy charged &nbsp;·&nbsp; 🔮 New arrivals every week
      </div>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-tag">✨ Trusted by 500+ happy customers</div>
            <h1>Healing Crystals,<br />Beautiful Bracelets</h1>
            <p>Each bracelet is handcrafted from authentic crystals to bring positive energy, balance, and peace into your daily life.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn-primary hero-cta">Shop Now →</Link>
              <Link to="/shop" className="hero-link">Browse collection</Link>
            </div>
            <div className="hero-microtrust">
              <span>🌿 Authentic</span>
              <span>🤲 Handcrafted</span>
              <span>✨ Charged</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow" />
            <div className="hero-crystal">💎</div>
            <div className="hero-crystal secondary">🔮</div>
            <div className="hero-crystal tertiary">✨</div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="trust-strip">
        <div className="trust-strip-inner">
          {[...TRUST_STRIP, ...TRUST_STRIP].map((t, i) => (
            <div key={i} className="trust-item">
              <span>{t.icon}</span>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured products ── */}
      <section className="featured container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Bracelets</h2>
            <p className="section-subtitle">Our most loved healing crystal pieces</p>
          </div>
          <Link to="/shop" className="btn-outline section-cta">View All</Link>
        </div>
        {loading && <Spinner />}
        {error && <p className="status-msg error">Could not load products: {error}</p>}
        {!loading && !error && (
          <div className="grid-3">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Shop by crystal ── */}
      <section className="crystals-section">
        <div className="container">
          <h2 className="section-title">Shop by Crystal</h2>
          <p className="section-subtitle">Find the stone that speaks to you</p>
          <div className="crystals-grid">
            {CRYSTALS.map(c => (
              <Link
                key={c.stone}
                to="/shop"
                state={{ stone: c.stone }}
                className="crystal-card"
              >
                <span className="crystal-emoji">{c.emoji}</span>
                <div className="crystal-name">{c.stone}</div>
                <div className="crystal-desc">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ShubhCrystals ── */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why ShubhCrystals?</h2>
          <p className="section-subtitle">Every detail crafted with intention</p>
          <div className="benefits-grid">
            {BENEFITS.map(b => (
              <div key={b.title} className="benefit-card">
                <span className="benefit-icon">{b.icon}</span>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section container">
        <h2 className="section-title">What our customers say</h2>
        <p className="section-subtitle">Real experiences from real crystal lovers</p>
        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">{'⭐'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar">{t.emoji}</span>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-meta">{t.location} · {t.crystal} bracelet</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to find your crystal?</h2>
            <p>Explore our full collection of handcrafted healing crystal bracelets.</p>
          </div>
          <Link to="/shop" className="cta-btn">Browse All Bracelets →</Link>
        </div>
      </section>

    </div>
  )
}
