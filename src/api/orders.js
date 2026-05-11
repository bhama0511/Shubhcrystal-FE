import { authFetch } from './client'

export const placeOrder = (payload, token) =>
  authFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) }, token)

export const fetchMyOrders = (token) =>
  authFetch('/api/orders/my', {}, token)

export const fetchAllOrders = (token) =>
  authFetch('/api/admin/orders', {}, token)

export const updateOrderStatus = (id, status, token) =>
  authFetch(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }, token)
