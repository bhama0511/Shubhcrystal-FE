import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Discover our beautiful crystal bracelets and add them to your cart.</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="cart-page container">
      <h1 className="section-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-emoji">{item.emoji}</div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.stone}</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span className="cart-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{total >= 999 ? 'Free' : '₹99'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{(total >= 999 ? total : total + 99).toLocaleString()}</span>
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <button className="btn-outline" style={{ width: '100%', marginTop: '0.75rem' }} onClick={clearCart}>
            Clear Cart
          </button>
          {total < 999 && (
            <p className="free-shipping-hint">Add ₹{(999 - total).toLocaleString()} more for free shipping!</p>
          )}
        </div>
      </div>
    </div>
  )
}
