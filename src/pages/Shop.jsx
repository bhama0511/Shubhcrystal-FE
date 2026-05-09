import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import { useProducts } from '../hooks/useProducts'
import './Shop.css'

export default function Shop() {
  const { products, loading, error } = useProducts()
  const [filter, setFilter] = useState('All')

  const stones = useMemo(
    () => ['All', ...new Set(products.map(p => p.stone))],
    [products]
  )

  const visible = filter === 'All'
    ? products
    : products.filter(p => p.stone === filter)

  return (
    <div className="shop container">
      <h1 className="section-title">Our Collection</h1>
      <p className="section-subtitle">Handcrafted crystal bracelets for every intention</p>

      {!loading && (
        <div className="filter-bar">
          {stones.map(s => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading && <Spinner />}
      {error && <p className="status-msg error">Could not load products: {error}</p>}
      {!loading && !error && (
        <div className="grid-3">
          {visible.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
