import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchAllProducts, deleteProduct, updateProduct } from '../../api/admin'
import Spinner from '../../components/Spinner'

export default function Products() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchAllProducts(token)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [token])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id, token)
      setProducts(p => p.filter(x => x.id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  const handleToggle = async (product) => {
    try {
      const updated = await updateProduct(product.id, { ...product, available: !product.available }, token)
      setProducts(p => p.map(x => x.id === updated.id ? updated : x))
    } catch (e) {
      alert(e.message)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Products</h1>
          <p className="admin-subtitle">{products.length} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
          + Add Product
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stone</th>
              <th>Price</th>
              <th>Badge</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, overflow: 'hidden',
                      background: 'linear-gradient(135deg,#f3e8ff,#e8c4d8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', flexShrink: 0
                    }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : p.emoji || '💎'
                      }
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{p.id}</div>
                    </div>
                  </div>
                </td>
                <td>{p.stone}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{Number(p.price).toLocaleString()}</td>
                <td>{p.badge ? <span className="badge-pill badge-admin">{p.badge}</span> : '—'}</td>
                <td>
                  <span className={`badge-pill ${p.available ? 'badge-active' : 'badge-hidden'}`}>
                    {p.available ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <Link to={`/admin/products/${p.id}/edit`} className="btn-sm btn-edit">Edit</Link>
                    <button
                      className={`btn-sm btn-toggle ${p.available ? '' : 'off'}`}
                      onClick={() => handleToggle(p)}
                    >
                      {p.available ? 'Hide' : 'Show'}
                    </button>
                    <button className="btn-sm btn-delete" onClick={() => handleDelete(p.id, p.name)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No products yet. <Link to="/admin/products/new">Add one →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
