import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products',  icon: '💎' },
  { to: '/admin/users',    label: 'Users',     icon: '👥' },
]

export default function AdminLayout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const close = () => setSidebarOpen(false)

  return (
    <div className="admin-shell">
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span>💎</span>
          <span>Admin</span>
          <button className="sidebar-close" onClick={close} aria-label="Close">✕</button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className="sidebar-link" onClick={close}>
              <span className="sidebar-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-avatar">{auth?.name?.[0]?.toUpperCase()}</span>
            <div>
              <div className="sidebar-name">{auth?.name}</div>
              <div className="sidebar-role">Administrator</div>
            </div>
          </div>
          <div className="sidebar-actions">
            <NavLink to="/" className="sidebar-back" onClick={close}>← Back to site</NavLink>
            <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </aside>

      <div className="admin-content">
        {/* Mobile top bar */}
        <div className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰ Menu
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
