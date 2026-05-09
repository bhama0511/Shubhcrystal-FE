import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchAllUsers } from '../../api/admin'
import Spinner from '../../components/Spinner'

export default function Users() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllUsers(token)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <Spinner />

  const admins = users.filter(u => u.role === 'ADMIN').length
  const customers = users.filter(u => u.role === 'USER').length

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Users</h1>
          <p className="admin-subtitle">{users.length} total · {admins} admins · {customers} customers</p>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: u.role === 'ADMIN' ? '#f3e8ff' : '#e8f4ff',
                      color: u.role === 'ADMIN' ? 'var(--primary-dark)' : '#1d64b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                    }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td>
                  <span className={`badge-pill ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
