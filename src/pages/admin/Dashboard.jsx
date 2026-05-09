import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchStats } from '../../api/admin'
import Spinner from '../../components/Spinner'
import './Dashboard.css'

const STAT_CARDS = [
  { key: 'totalProducts',     label: 'Total Products',    icon: '💎', link: '/admin/products' },
  { key: 'availableProducts', label: 'Active Listings',   icon: '✅', link: '/admin/products' },
  { key: 'totalUsers',        label: 'Registered Users',  icon: '👥', link: '/admin/users' },
  { key: null,                label: 'Orders (coming)',    icon: '📦', link: null },
]

export default function Dashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats(token)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <Spinner />

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Overview of your store</p>
        </div>
      </div>

      <div className="stats-grid">
        {STAT_CARDS.map(({ key, label, icon, link }) => {
          const value = key ? stats?.[key] ?? '—' : '—'
          const card = (
            <div className="stat-card" key={label}>
              <div className="stat-icon">{icon}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          )
          return link
            ? <Link to={link} key={label} style={{ textDecoration: 'none' }}>{card}</Link>
            : <div key={label}>{card}</div>
        })}
      </div>

      <div className="dash-shortcuts">
        <h2 className="admin-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div className="shortcut-grid">
          <Link to="/admin/products/new" className="shortcut-card">
            <span>➕</span> Add New Product
          </Link>
          <Link to="/admin/products" className="shortcut-card">
            <span>💎</span> Manage Products
          </Link>
          <Link to="/admin/users" className="shortcut-card">
            <span>👥</span> View Users
          </Link>
          <Link to="/shop" className="shortcut-card">
            <span>🛍️</span> View Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
