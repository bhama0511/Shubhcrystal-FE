import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchAllOrders, updateOrderStatus } from '../../api/orders'
import Spinner from '../../components/Spinner'

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const STATUS_BADGE = {
  PENDING:   'badge-pending',
  CONFIRMED: 'badge-confirmed',
  SHIPPED:   'badge-shipped',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Orders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchAllOrders(token)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      const updated = await updateOrderStatus(id, status, token)
      setOrders(o => o.map(x => x.id === id ? updated : x))
    } catch (e) {
      alert(e.message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <Spinner />

  const pending = orders.filter(o => o.status === 'PENDING').length

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Orders</h1>
          <p className="admin-subtitle">{orders.length} total · {pending} pending</p>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>#{o.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {o.shippingCity} · {o.shippingPincode}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.customerName || o.shippingName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {o.customerEmail || '—'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {o.shippingPhone}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.85rem' }}>
                    {o.items.map(it => (
                      <div key={it.id}>
                        <span style={{ marginRight: '0.3rem' }}>{it.productEmoji || '💎'}</span>
                        {it.productName} <span style={{ color: 'var(--text-muted)' }}>× {it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                  ₹{Number(o.total).toLocaleString()}
                </td>
                <td>
                  <select
                    className={`status-select ${STATUS_BADGE[o.status] || ''}`}
                    value={o.status}
                    disabled={updatingId === o.id}
                    onChange={e => handleStatusChange(o.id, e.target.value)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatDate(o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No orders placed yet.
          </div>
        )}
      </div>

      <style>{`
        .status-select {
          padding: 0.4rem 0.65rem;
          border-radius: 8px;
          border: 1px solid #e0d4f0;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          cursor: pointer;
          background: #f8f5ff;
        }
        .status-select:disabled { opacity: 0.6; cursor: wait; }
        .status-select.badge-pending   { background: #fef3c7; color: #92400e; border-color: #fde68a; }
        .status-select.badge-confirmed { background: #dbeafe; color: #1e40af; border-color: #bfdbfe; }
        .status-select.badge-shipped   { background: #ede9fe; color: #5b21b6; border-color: #ddd6fe; }
        .status-select.badge-delivered { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
        .status-select.badge-cancelled { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
      `}</style>
    </div>
  )
}
