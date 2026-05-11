import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/auth'
import './AuthForm.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-icon">⚠️</span>
            <h1>Missing reset link</h1>
            <p>This page needs a valid reset link from your email.</p>
          </div>
          <p className="auth-switch">
            <Link to="/forgot-password">Request a new link</Link>
          </p>
        </div>
      </div>
    )
  }

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords don’t match')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, form.password)
      navigate('/login', { replace: true, state: { resetSuccess: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔑</span>
          <h1>Set a new password</h1>
          <p>Choose something you'll remember.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            New password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoFocus
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              placeholder="Type it again"
              required
              minLength={8}
            />
          </label>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
