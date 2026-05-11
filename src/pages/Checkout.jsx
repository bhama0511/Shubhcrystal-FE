import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrder } from '../api/orders'
import './Checkout.css'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const { auth, token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shippingName: auth?.name || '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPincode: '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const shipping = total >= 999 ? 0 : total > 0 ? 99 : 0
  const grandTotal = total + shipping

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  if (cart.length === 0) {
    return (
      <div className="checkout-empty container">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add a few crystals before heading to checkout.</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
        shippingName: form.shippingName.trim(),
        shippingPhone: form.shippingPhone.trim(),
        shippingAddress: form.shippingAddress.trim(),
        shippingCity: form.shippingCity.trim(),
        shippingPincode: form.shippingPincode.trim(),
      }
      await placeOrder(payload, token)
      clearCart()
      navigate('/orders', { replace: true, state: { justPlaced: true } })
    } catch (err) {
      setError(err.message || 'Could not place order. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="checkout-page container">
      <h1 className="section-title">Checkout</h1>

      <form id="checkout-form" onSubmit={onSubmit} className="checkout-layout" noValidate>
        <section className="checkout-card">
          <h2>Shipping address</h2>

          {error && <div className="auth-error">{error}</div>}

          <label>
            Full name
            <input
              name="shippingName"
              value={form.shippingName}
              onChange={onChange}
              placeholder="Riya Sharma"
              required
              maxLength={100}
            />
          </label>

          <label>
            Phone number
            <input
              name="shippingPhone"
              type="tel"
              inputMode="tel"
              value={form.shippingPhone}
              onChange={onChange}
              placeholder="+91 98765 43210"
              required
              pattern="^[0-9+\-\s]{7,20}$"
            />
          </label>

          <label>
            Street address
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={onChange}
              placeholder="House / flat, street, area, landmark"
              required
              rows={3}
              maxLength={500}
            />
          </label>

          <div className="checkout-row">
            <label>
              City
              <input
                name="shippingCity"
                value={form.shippingCity}
                onChange={onChange}
                placeholder="Mumbai"
                required
                maxLength={100}
              />
            </label>

            <label>
              Pincode
              <input
                name="shippingPincode"
                inputMode="numeric"
                value={form.shippingPincode}
                onChange={onChange}
                placeholder="400001"
                required
                pattern="^[0-9]{4,10}$"
              />
            </label>
          </div>

          <div className="payment-note">
            <span>💵</span>
            <div>
              <strong>Cash on Delivery</strong>
              <p>Online payment coming soon. For now, pay when your order arrives.</p>
            </div>
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul className="summary-items">
            {cart.map(i => (
              <li key={i.id}>
                <span className="summary-item-emoji">{i.emoji || '💎'}</span>
                <span className="summary-item-name">
                  {i.name}
                  <span className="summary-item-qty">× {i.qty}</span>
                </span>
                <span className="summary-item-price">
                  ₹{(i.price * i.qty).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="btn-primary checkout-submit"
            disabled={submitting}
          >
            {submitting ? 'Placing order…' : `Place order • ₹${grandTotal.toLocaleString()}`}
          </button>
        </aside>
      </form>

      {/* Sticky bottom CTA — mobile only */}
      <div className="checkout-sticky-bar">
        <div className="checkout-sticky-total">
          <span>Total</span>
          <strong>₹{grandTotal.toLocaleString()}</strong>
        </div>
        <button
          type="submit"
          form="checkout-form"
          className="btn-primary checkout-sticky-btn"
          disabled={submitting}
        >
          {submitting ? 'Placing…' : 'Place order'}
        </button>
      </div>
    </div>
  )
}
