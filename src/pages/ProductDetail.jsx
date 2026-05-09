import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import './ProductDetail.css'

const TRUST = [
  { icon: '🌿', label: 'Authentic Crystals' },
  { icon: '🤲', label: 'Handcrafted with Love' },
  { icon: '🚚', label: 'Free Ship ₹999+' },
  { icon: '✨', label: 'Energy Charged' },
]

const BENEFIT_ICONS = ['🌟', '💫', '⚡', '🌙', '🔮']

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { product, loading, error } = useProduct(id)
  const { products: allProducts } = useProducts()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const related = allProducts.filter(p => p.id !== Number(id)).slice(0, 3)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  if (loading) return <Spinner />

  if (error || !product) {
    return (
      <div className="not-found container">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="pd-page">
      <div className="container">
        <Link to="/shop" className="back-link">← Back to Shop</Link>

        <div className="pd-grid">

          {/* ── Left: Image ── */}
          <div className="pd-image-col">
            <div className="pd-main-image">
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} />
                : <span className="pd-emoji">{product.emoji || '💎'}</span>
              }
              {product.badge && <span className="pd-badge-img">{product.badge}</span>}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info-col">

            {/* Name + badge */}
            {product.badge && <span className="pd-badge">{product.badge}</span>}
            <h1 className="pd-name">{product.name}</h1>

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">₹{Number(product.price).toLocaleString()}</span>
              <span className="pd-tax">incl. all taxes</span>
            </div>

            <div className="pd-divider" />

            {/* Stone + chakra chips */}
            <div className="pd-chips">
              <div className="pd-chip">
                <span>💎</span>
                <div>
                  <div className="pd-chip-label">Stone</div>
                  <div className="pd-chip-value">{product.stone}</div>
                </div>
              </div>
              {product.chakra && (
                <div className="pd-chip">
                  <span>🔮</span>
                  <div>
                    <div className="pd-chip-label">Chakra</div>
                    <div className="pd-chip-value">{product.chakra}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pd-divider" />

            {/* Description */}
            <p className="pd-description">{product.description}</p>

            {/* Benefits */}
            {product.benefits?.length > 0 && (
              <div className="pd-benefits-section">
                <h3 className="pd-section-heading">What it does for you</h3>
                <div className="pd-benefit-cards">
                  {product.benefits.map((b, i) => (
                    <div key={b} className="pd-benefit-card">
                      <span className="pd-benefit-icon">{BENEFIT_ICONS[i % BENEFIT_ICONS.length]}</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart — desktop only */}
            <div className="pd-buy-desktop">
              <div className="pd-qty-row">
                <span className="pd-qty-label">Quantity</span>
                <div className="pd-qty-ctrl">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>
              <button
                className={`pd-add-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              {TRUST.map(t => (
                <div key={t.label} className="pd-trust-item">
                  <span className="pd-trust-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>

            <div className="pd-divider" />

            {/* Product details */}
            <div className="pd-specs">
              <h3 className="pd-section-heading">Product Details</h3>
              {[
                ['Stone',    product.stone],
                ['Chakra',   product.chakra || '—'],
                ['Material', `Natural ${product.stone}, elastic cord`],
                ['Size',     'Adjustable — fits 6–8 inch wrist'],
                ['Care',     'Avoid water and direct sunlight'],
                ['Shipping', 'Free above ₹999 · Delivered in 3–5 days'],
                ['Returns',  '7-day easy return policy'],
              ].map(([k, v]) => (
                <div key={k} className="pd-spec-row">
                  <span className="pd-spec-key">{k}</span>
                  <span className="pd-spec-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="section-title">You may also like</h2>
            <p className="section-subtitle">More healing crystals from our collection</p>
            <div className="grid-3">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar — mobile only */}
      <div className="pd-sticky-bar">
        <div className="pd-sticky-left">
          <div className="pd-price" style={{ fontSize: '1.3rem' }}>
            ₹{Number(product.price).toLocaleString()}
          </div>
          <div className="pd-qty-ctrl compact">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>
        <button
          className={`pd-add-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          style={{ flex: 1 }}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
