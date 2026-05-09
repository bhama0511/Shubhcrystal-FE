import { authFetch } from './client'

export const fetchStats      = (token) => authFetch('/api/admin/stats',    {}, token)
export const fetchAllUsers   = (token) => authFetch('/api/admin/users',    {}, token)
export const fetchAllProducts = (token) => authFetch('/api/admin/products', {}, token)

export const createProduct = (data, token) =>
  authFetch('/api/products', { method: 'POST', body: JSON.stringify(data) }, token)

export const updateProduct = (id, data, token) =>
  authFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token)

export const deleteProduct = (id, token) =>
  fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => { if (!res.ok) throw new Error('Delete failed') })
