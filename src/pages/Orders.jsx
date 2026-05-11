import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../api/orders'
import Spinner from '../components/Spinner'
import './Orders.css'

const STATUS_LABEL = {
  PENDING:   { text: 'Pending',   className: 'status-pending' },
  CONFIRMED: { text: 'Confirmed', className: 'status-confirmed' },
  SHIPPED:   { text: 'Shipped',   className: 'status-shipped' },
  DELIVERED: { text: 'Delivered', className: 'status-delivered' },
  CANCELLED: { text: 'Cancelled', className: 'status-cancelled' },
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Orders() {
  const { token } = useAuth()
  const location = useLocation()
  const justPlaced = location.state?.justPlaced

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMyOrders(token)
      .then(data => { if (!cancelled) setOrders(data) })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  if (loading) return <Spinner />
  if (error) return <div className="status-msg error container">{error}</div>

  if (orders.length === 0) {
    return (
      <div className="orders-empty container">
        <div className="empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>When you place an order it'll show up here.</p>
        <Link to="/shop" className="btn-primary">Start shopping</Link>
      </div>
    )
  }

  return (
    <div className="orders-page container">
      <h1 className="section-title">My Orders</h1>

      {justPlaced && (
        <div className="orders-success">
          ✅ Order placed successfully! We'll be in touch about delivery.
        </div>
      )}

      <div className="orders-list">
        {orders.map(o => {
          const status = STATUS_LABEL[o.status] || { text: o.status, className: '' }
          return (
            <article key={o.id} className="order-card">
              <header className="order-card-head">
                <div>
                  <h3>Order #{o.id}</h3>
                  <p className="order-date">{formatDate(o.createdAt)}</p>
                </div>
                <span className={`status-badge ${status.className}`}>{status.text}</span>
              </header>

              <ul className="order-items">
                {o.items.map(it => (
                  <li key={it.id}>
                    <span className="order-item-emoji">{it.productEmoji || '💎'}</span>
                    <span className="order-item-name">
                      {it.productName}
                      <span className="order-item-qty">× {it.quantity}</span>
                    </span>
                    <span className="order-item-price">
                      ₹{(Number(it.price) * it.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <footer className="order-card-foot">
                <div className="order-shipping">
                  <strong>Shipping to:</strong>
                  <span>
                    {o.shippingName} • {o.shippingPhone}<br />
                    {o.shippingAddress}, {o.shippingCity} - {o.shippingPincode}
                  </span>
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <strong>₹{Number(o.total).toLocaleString()}</strong>
                </div>
              </footer>
            </article>
          )
        })}
      </div>
    </div>
  )
}
