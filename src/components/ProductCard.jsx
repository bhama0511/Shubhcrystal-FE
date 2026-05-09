import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} className="product-img" />
          : (
            <div className="product-image-placeholder">
              <span>{product.emoji || '💎'}</span>
            </div>
          )
        }
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-stone">{product.stone}</p>
        <div className="product-footer">
          <span className="product-price">₹{Number(product.price).toLocaleString()}</span>
          <button className="btn-primary" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
