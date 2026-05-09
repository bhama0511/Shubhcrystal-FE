export async function uploadImage(file) {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch('/api/upload', { method: 'POST', body })
  if (!res.ok) throw new Error('Image upload failed')
  return res.json() // { url, publicId }
}
