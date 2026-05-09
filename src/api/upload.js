export async function uploadImage(file, token) {
  const body = new FormData()
  body.append('file', file)

  // Do NOT set Content-Type — browser sets it automatically with the correct boundary
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  })
  if (!res.ok) throw new Error('Image upload failed')
  return res.json() // { url, publicId }
}
