import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../api/products'
import './Shop.css'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [stones, setStones] = useState(['All'])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data)
        setStones(['All', ...new Set(data.map(p => p.stone))])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleFilter = (stone) => {
    setFilter(stone)
    setLoading(true)
    const req = stone === 'All' ? fetchProducts() : fetchProducts(stone)
    req
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="shop container">
      <h1 className="section-title">Our Collection</h1>
      <p className="section-subtitle">Handcrafted crystal bracelets for every intention</p>

      <div className="filter-bar">
        {stones.map(s => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => handleFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="status-msg">Loading products...</p>}
      {error && <p className="status-msg error">Could not load products: {error}</p>}
      {!loading && !error && (
        <div className="grid-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
