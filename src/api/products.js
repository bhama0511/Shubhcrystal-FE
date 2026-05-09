const BASE = '/api/products'

export async function fetchProducts(stone) {
  const url = stone ? `${BASE}?stone=${encodeURIComponent(stone)}` : BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}
