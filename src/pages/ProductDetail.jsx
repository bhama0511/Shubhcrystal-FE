import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchProduct } from '../api/products'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="status-msg container">Loading...</div>

  if (error || !product) {
    return (
      <div className="not-found container">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="product-detail container">
      <Link to="/shop" className="back-link">← Back to Shop</Link>
      <div className="detail-grid">
        <div className="detail-image">
          <span>{product.emoji || '💎'}</span>
        </div>
        <div className="detail-info">
          {product.badge && <span className="detail-badge">{product.badge}</span>}
          <h1>{product.name}</h1>
          <p className="detail-stone">Stone: {product.stone} &nbsp;|&nbsp; Chakra: {product.chakra}</p>
          <p className="detail-description">{product.description}</p>
          {product.benefits?.length > 0 && (
            <ul className="detail-benefits">
              {product.benefits.map(b => (
                <li key={b}>✓ {b}</li>
              ))}
            </ul>
          )}
          <div className="detail-footer">
            <span className="detail-price">₹{Number(product.price).toLocaleString()}</span>
            <button className="btn-primary" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
