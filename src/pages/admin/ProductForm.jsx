import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createProduct, updateProduct } from '../../api/admin'
import { uploadImage } from '../../api/upload'
import Spinner from '../../components/Spinner'
import './ProductForm.css'

const EMPTY = {
  name: '', stone: '', price: '', description: '',
  chakra: '', badge: '', emoji: '', available: true,
  imageUrl: '', benefitsText: '',
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const { token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit) return
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(p => {
        setForm({
          name: p.name || '',
          stone: p.stone || '',
          price: p.price || '',
          description: p.description || '',
          chakra: p.chakra || '',
          badge: p.badge || '',
          emoji: p.emoji || '',
          available: p.available ?? true,
          imageUrl: p.imageUrl || '',
          benefitsText: (p.benefits || []).join('\n'),
        })
        if (p.imageUrl) setImagePreview(p.imageUrl)
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const onChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      let imageUrl = form.imageUrl

      // Upload new image if one was selected
      if (imageFile) {
        const uploaded = await uploadImage(imageFile, token)
        imageUrl = uploaded.url
      }

      const payload = {
        name:        form.name,
        stone:       form.stone,
        price:       parseFloat(form.price),
        description: form.description,
        chakra:      form.chakra || null,
        badge:       form.badge || null,
        emoji:       form.emoji || null,
        available:   form.available,
        imageUrl:    imageUrl || null,
        benefits:    form.benefitsText.split('\n').map(b => b.trim()).filter(Boolean),
      }

      if (isEdit) {
        await updateProduct(id, payload, token)
      } else {
        await createProduct(payload, token)
      }

      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="admin-subtitle">{isEdit ? `Editing product #${id}` : 'Create a new crystal bracelet listing'}</p>
        </div>
        <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          onClick={() => navigate('/admin/products')}>
          ← Back
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={onSubmit} className="product-form-grid">
        {/* Left: image */}
        <div className="pf-image-col">
          <div className="pf-image-preview">
            {imagePreview
              ? <img src={imagePreview} alt="preview" />
              : <span>{form.emoji || '💎'}</span>
            }
          </div>
          <label className="pf-upload-btn">
            📷 {imagePreview ? 'Change Image' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={onImageChange} hidden />
          </label>
          {imagePreview && (
            <button type="button" className="pf-remove-img"
              onClick={() => { setImageFile(null); setImagePreview(null); setForm(f => ({ ...f, imageUrl: '' })) }}>
              Remove image
            </button>
          )}
        </div>

        {/* Right: fields */}
        <div className="pf-fields-col">
          <div className="admin-card">
            <div className="pf-grid">
              <label className="pf-field pf-span2">
                Product Name *
                <input name="name" value={form.name} onChange={onChange} required placeholder="e.g. Amethyst Calm Bracelet" />
              </label>

              <label className="pf-field">
                Stone *
                <input name="stone" value={form.stone} onChange={onChange} required placeholder="e.g. Amethyst" />
              </label>

              <label className="pf-field">
                Price (₹) *
                <input name="price" type="number" value={form.price} onChange={onChange} required min="1" placeholder="799" />
              </label>

              <label className="pf-field">
                Chakra
                <input name="chakra" value={form.chakra} onChange={onChange} placeholder="Crown Chakra" />
              </label>

              <label className="pf-field">
                Badge
                <input name="badge" value={form.badge} onChange={onChange} placeholder="Bestseller, New, Premium…" />
              </label>

              <label className="pf-field">
                Emoji
                <input name="emoji" value={form.emoji} onChange={onChange} placeholder="💎" />
              </label>

              <label className="pf-field pf-span2">
                Description
                <textarea name="description" value={form.description} onChange={onChange}
                  rows={3} placeholder="Describe the crystal and its healing properties…" />
              </label>

              <label className="pf-field pf-span2">
                Benefits (one per line)
                <textarea name="benefitsText" value={form.benefitsText} onChange={onChange}
                  rows={3} placeholder={"Reduces stress & anxiety\nEnhances intuition\nPromotes restful sleep"} />
              </label>

              <label className="pf-field pf-checkbox">
                <input type="checkbox" name="available" checked={form.available} onChange={onChange} />
                <span>Listed & visible in shop</span>
              </label>
            </div>

            <div className="pf-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
