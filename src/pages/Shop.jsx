import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import { useProducts } from '../hooks/useProducts'
import './Shop.css'

const STONE_EMOJI = {
  'Amethyst':         '💜',
  'Rose Quartz':      '🌸',
  'Clear Quartz':     '🔮',
  'Black Tourmaline': '🖤',
  'Citrine':          '💛',
  'Lapis Lazuli':     '💙',
}

export default function Shop() {
  const location = useLocation()
  const { products, loading, error } = useProducts()
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('default')

  // Support coming from Home "Shop by Crystal" links
  useEffect(() => {
    if (location.state?.stone) {
      setFilter(location.state.stone)
    }
  }, [location.state])

  const stones = useMemo(
    () => ['All', ...new Set(products.map(p => p.stone))],
    [products]
  )

  const visible = useMemo(() => {
    let list = filter === 'All' ? products : products.filter(p => p.stone === filter)
    if (sort === 'asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [products, filter, sort])

  return (
    <div className="shop">

      {/* ── Shop header ── */}
      <div className="shop-header container">
        <div className="shop-title-wrap">
          <h1 className="section-title" style={{ marginBottom: 0 }}>Our Collection</h1>
          <p className="shop-count">
            {loading ? 'Loading…' : `${visible.length} bracelet${visible.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <select
          className="shop-sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="default">Sort: Featured</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* ── Filter bar ── */}
      {!loading && (
        <div className="shop-filter-wrap container">
          <div className="filter-bar">
            {stones.map(s => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s !== 'All' && STONE_EMOJI[s] && (
                  <span className="filter-emoji">{STONE_EMOJI[s]}</span>
                )}
                {s}
              </button>
            ))}
          </div>

          {/* Active filter chip */}
          {filter !== 'All' && (
            <div className="active-filter">
              <span>{STONE_EMOJI[filter]} Filtering: <strong>{filter}</strong></span>
              <button className="clear-filter" onClick={() => setFilter('All')}>✕ Clear</button>
            </div>
          )}
        </div>
      )}

      {/* ── Product grid ── */}
      <div className="container">
        {loading && <Spinner />}
        {error && <p className="status-msg error">Could not load products: {error}</p>}

        {!loading && !error && visible.length === 0 && (
          <div className="shop-empty">
            <div className="shop-empty-icon">🔍</div>
            <h3>No bracelets found</h3>
            <p>We don't have any <strong>{filter}</strong> bracelets right now.</p>
            <button className="btn-primary" onClick={() => setFilter('All')}>
              Show all bracelets
            </button>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="grid-3">
            {visible.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
