import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProduct'
import Spinner from '../components/Spinner'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { product, loading, error } = useProduct(id)

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
    <div className="product-detail container">
      <Link to="/shop" className="back-link">← Back to Shop</Link>
      <div className="detail-grid">
        <div className="detail-image">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="detail-img" />
            : <span>{product.emoji || '💎'}</span>
          }
        </div>
        <div className="detail-info">
          {product.badge && <span className="detail-badge">{product.badge}</span>}
          <h1>{product.name}</h1>
          <p className="detail-stone">Stone: {product.stone} &nbsp;|&nbsp; Chakra: {product.chakra}</p>
          <p className="detail-description">{product.description}</p>
          {product.benefits?.length > 0 && (
            <ul className="detail-benefits">
              {product.benefits.map(b => <li key={b}>✓ {b}</li>)}
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
