import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import './Shop.css'

const STONES = ['All', ...new Set(PRODUCTS.map(p => p.stone))]

export default function Shop() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.stone === filter)

  return (
    <div className="shop container">
      <h1 className="section-title">Our Collection</h1>
      <p className="section-subtitle">Handcrafted crystal bracelets for every intention</p>

      <div className="filter-bar">
        {STONES.map(s => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
