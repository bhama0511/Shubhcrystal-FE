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

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span>💎</span>
          <span>Admin</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className="sidebar-link">
              <span className="sidebar-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-avatar">
              {auth?.name?.[0]?.toUpperCase()}
            </span>
            <div>
              <div className="sidebar-name">{auth?.name}</div>
              <div className="sidebar-role">Administrator</div>
            </div>
          </div>
          <div className="sidebar-actions">
            <NavLink to="/" className="sidebar-back">← Back to site</NavLink>
            <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
