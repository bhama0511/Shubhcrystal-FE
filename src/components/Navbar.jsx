import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { itemCount } = useCart()
  const { isLoggedIn, isAdmin, auth, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-icon">💎</span>
          <span className="brand-name">ShubhCrystals</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          {isLoggedIn && !isAdmin && <NavLink to="/orders">My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <span className="nav-user">Hi, {auth.name.split(' ')[0]}</span>
              <button className="btn-outline nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-outline nav-login">Login</Link>
              <Link to="/register" className="btn-primary nav-register">Register</Link>
            </>
          )}
          <Link to="/cart" className="cart-btn">
            <span>Cart</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="mobile-controls">
          <Link to="/cart" className="mobile-cart" onClick={close}>
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-menu ${menuOpen ? 'visible' : ''}`}>
        <NavLink to="/" end className="mobile-nav-link" onClick={close}>🏠 Home</NavLink>
        <NavLink to="/shop"  className="mobile-nav-link" onClick={close}>💎 Shop</NavLink>
        {isLoggedIn && !isAdmin && (
          <NavLink to="/orders" className="mobile-nav-link" onClick={close}>📦 My Orders</NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className="mobile-nav-link" onClick={close}>⚙️ Admin Panel</NavLink>
        )}
        <div className="mobile-divider" />
        {isLoggedIn ? (
          <>
            <div className="mobile-user">Hi, {auth.name} 👋</div>
            <button className="mobile-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <div className="mobile-auth-row">
            <Link to="/login"    className="btn-outline" onClick={close} style={{ flex: 1, textAlign: 'center', padding: '0.65rem' }}>Login</Link>
            <Link to="/register" className="btn-primary" onClick={close} style={{ flex: 1, textAlign: 'center', padding: '0.65rem' }}>Register</Link>
          </div>
        )}
      </div>
    </header>
  )
}
