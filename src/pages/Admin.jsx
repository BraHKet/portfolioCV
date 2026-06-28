import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import TagPill from '../components/TagPill'

const ADMIN_PASSWORD = 'domina2024'
const STORAGE_KEY = 'portfolio_data'

/* ─── Login screen ──────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin', 'true')
      onLogin()
    } else {
      setError('Incorrect password.')
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__box" onSubmit={handleSubmit}>
        <h1 className="admin-login__title">Admin access</h1>
        <input
          className="admin-login__input"
          type="password"
          placeholder="Password"
          value={pw}
          autoFocus
          onChange={e => { setPw(e.target.value); setError('') }}
        />
        {error && <p className="admin-login__error">{error}</p>}
        <button className="admin-login__btn" type="submit">Enter</button>
      </form>
    </div>
  )
}

/* ─── Profile editor ────────────────────────────────────────────── */
function ProfileEditor({ profile, onSave }) {
  const [form, setForm] = useState({ ...profile })

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handlePhotoFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const MAX = 600
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        set('photoUrl', canvas.toDataURL('image/jpeg', 0.88))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleSave(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSave}>
      <h2 className="admin-form__title">Edit profile</h2>

      <div className="form-group">
        <label className="form-label">Profile photo</label>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)', marginBottom: 8 }}>
          {form.photoUrl ? (
            <img
              src={form.photoUrl}
              alt="preview"
              style={{ width: 80, height: 80, objectFit: 'cover', objectPosition: 'center top', border: '1px solid var(--border)', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 80, height: 80, background: 'var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No photo</span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input type="file" accept="image/*" onChange={handlePhotoFile} />
            {form.photoUrl && (
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                onClick={() => set('photoUrl', '')}
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
        <p className="form-hint">Square crop recommended. Shown next to your name on the homepage.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Name</label>
        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Bio</label>
        <textarea className="form-textarea" value={form.bio} onChange={e => set('bio', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">LinkedIn URL</label>
        <input className="form-input" type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">GitHub URL</label>
        <input className="form-input" type="url" value={form.github} onChange={e => set('github', e.target.value)} />
      </div>

      <div className="form-actions">
        <button className="btn-primary" type="submit">Save profile</button>
      </div>
    </form>
  )
}

/* ─── Project editor ────────────────────────────────────────────── */
function ProjectEditor({ project, onSave, onDelete }) {
  const [form, setForm] = useState({ ...project })
  const [galleryUrlInput, setGalleryUrlInput] = useState('')

  useEffect(() => {
    setForm({ ...project })
    setGalleryUrlInput('')
  }, [project.id])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function resizeAndEncode(file, maxPx, quality, callback) {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        callback(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  function handleImageFile(e) {
    const file = e.target.files[0]
    if (!file) return
    resizeAndEncode(file, 1200, 0.82, data => set('imageUrl', data))
    e.target.value = ''
  }

  function handleGalleryFile(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    files.forEach(file => {
      resizeAndEncode(file, 1200, 0.82, data => {
        setForm(f => ({ ...f, images: [...(f.images || []), data] }))
      })
    })
    e.target.value = ''
  }

  function handleGalleryUrlAdd() {
    const url = galleryUrlInput.trim()
    if (!url) return
    setForm(f => ({ ...f, images: [...(f.images || []), url] }))
    setGalleryUrlInput('')
  }

  function handleGalleryRemove(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  function handleSave(e) {
    e.preventDefault()
    const cleaned = {
      ...form,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : form.tags,
      results: typeof form.results === 'string'
        ? form.results.split('\n').map(r => r.trim()).filter(Boolean)
        : form.results,
    }
    onSave(cleaned)
  }

  function handleDelete() {
    if (window.confirm(`Delete "${form.title}"? This cannot be undone.`)) {
      onDelete(form.id)
    }
  }

  const tagsRaw = typeof form.tags === 'string'
    ? form.tags
    : (form.tags || []).join(', ')

  const tagsPreview = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

  const resultsRaw = typeof form.results === 'string'
    ? form.results
    : (form.results || []).join('\n')

  return (
    <form onSubmit={handleSave}>
      <h2 className="admin-form__title">
        {form.title || 'New project'}
      </h2>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>

      <div className="form-group">
        <label className="form-label">Short description</label>
        <input className="form-input" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} />
        <p className="form-hint">One line shown on the project card.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Full description</label>
        <textarea
          className="form-textarea form-textarea--tall"
          value={form.fullDescription}
          onChange={e => set('fullDescription', e.target.value)}
        />
        <p className="form-hint">Use blank lines to separate paragraphs.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Tags (comma-separated)</label>
        <input
          className="form-input"
          value={tagsRaw}
          onChange={e => set('tags', e.target.value)}
          placeholder="Python, SQL, Tableau"
        />
        {tagsPreview.length > 0 && (
          <div className="form-tags-preview">
            {tagsPreview.map(t => <TagPill key={t} label={t} />)}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Key results (one per line)</label>
        <textarea
          className="form-textarea"
          value={resultsRaw}
          onChange={e => set('results', e.target.value)}
          placeholder={"AUC-ROC of 0.91\nReduced churn by 18%"}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Cover image (used in project card)</label>
        <input
          className="form-input"
          placeholder="https://..."
          value={form.imageUrl && !form.imageUrl.startsWith('data:') ? form.imageUrl : ''}
          onChange={e => set('imageUrl', e.target.value)}
        />
        <p className="form-hint" style={{ marginBottom: 6 }}>Or upload a file:</p>
        <input type="file" accept="image/*" onChange={handleImageFile} />
        {form.imageUrl && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <img
              src={form.imageUrl}
              alt="cover preview"
              style={{ height: 64, maxWidth: 120, objectFit: 'cover', border: '1px solid var(--border)' }}
            />
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
              onClick={() => set('imageUrl', '')}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Gallery images (carousel on detail page)</label>
        {(form.images || []).length > 0 && (
          <div className="admin-gallery-thumbs">
            {(form.images || []).map((src, i) => (
              <div key={i} className="admin-gallery-thumb">
                <img src={src} alt="" />
                <button
                  type="button"
                  className="admin-gallery-thumb__remove"
                  onClick={() => handleGalleryRemove(i)}
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="form-hint" style={{ marginBottom: 6 }}>Add by URL:</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="form-input"
            placeholder="https://..."
            value={galleryUrlInput}
            onChange={e => setGalleryUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleGalleryUrlAdd())}
          />
          <button type="button" className="btn-secondary" onClick={handleGalleryUrlAdd} style={{ flexShrink: 0 }}>
            Add
          </button>
        </div>
        <p className="form-hint" style={{ marginTop: 6 }}>Or upload multiple files:</p>
        <input type="file" accept="image/*" multiple onChange={handleGalleryFile} />
      </div>

      <div className="form-group">
        <label className="form-label">Video URL (embed)</label>
        <input
          className="form-input"
          type="url"
          value={form.videoUrl}
          onChange={e => set('videoUrl', e.target.value)}
          placeholder="https://www.youtube.com/embed/..."
        />
        <p className="form-hint">Use the embed URL (e.g. youtube.com/embed/…). Replaces the image on the detail page.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Repository URL</label>
        <input className="form-input" type="url" value={form.repoUrl} onChange={e => set('repoUrl', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Live URL</label>
        <input className="form-input" type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Period</label>
        <input className="form-input" value={form.period} onChange={e => set('period', e.target.value)} placeholder="Jan 2024 – Mar 2024" />
      </div>

      <div className="form-group">
        <div className="form-checkbox-row">
          <input
            id="featured"
            type="checkbox"
            checked={!!form.featured}
            onChange={e => set('featured', e.target.checked)}
          />
          <label htmlFor="featured">Featured (shown first in the grid)</label>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary" type="submit">Save project</button>
        <button className="btn-danger" type="button" onClick={handleDelete}>Delete</button>
      </div>
    </form>
  )
}

/* ─── Admin panel ───────────────────────────────────────────────── */
function AdminPanel({ initialData, onDataChange }) {
  const [data, setData] = useState(initialData)
  const [activeId, setActiveId] = useState('__profile__')

  function persist(nextData) {
    // always update in-memory state first
    setData(nextData)
    onDataChange?.(nextData)
    // localStorage can fail if data is too large (base64 images)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    } catch {
      // quota exceeded — data is live for this session; use Export JSON to persist
    }
  }

  function handleProfileSave(profile) {
    persist({ ...data, profile })
    alert('Profile saved.')
  }

  function handleProjectSave(updated) {
    const exists = data.projects.find(p => p.id === updated.id)
    const projects = exists
      ? data.projects.map(p => p.id === updated.id ? updated : p)
      : [...data.projects, updated]
    persist({ ...data, projects })
    setActiveId(updated.id)
    alert('Project saved.')
  }

  function handleProjectDelete(id) {
    const projects = data.projects.filter(p => p.id !== id)
    persist({ ...data, projects })
    setActiveId('__profile__')
  }

  function handleReorder(id, direction) {
    const idx = data.projects.findIndex(p => p.id === id)
    const next = idx + direction
    if (next < 0 || next >= data.projects.length) return
    const projects = [...data.projects]
    ;[projects[idx], projects[next]] = [projects[next], projects[idx]]
    persist({ ...data, projects })
  }

  function handleNewProject() {
    const blank = {
      id: `project-${Date.now()}`,
      title: '',
      shortDescription: '',
      fullDescription: '',
      tags: '',
      results: '',
      imageUrl: '',
      images: [],
      videoUrl: '',
      repoUrl: '',
      liveUrl: '',
      period: '',
      featured: false,
    }
    setData(d => ({ ...d, projects: [...d.projects, blank] }))
    setActiveId(blank.id)
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'projects.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeProject = data.projects.find(p => p.id === activeId)

  return (
    <div className="admin-layout">
      <AdminSidebar
        projects={data.projects}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewProject}
        onReorder={handleReorder}
      />
      <div className="admin-main">
        {activeId === '__profile__' && (
          <>
            <ProfileEditor profile={data.profile} onSave={handleProfileSave} />
            <div style={{ marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>
                All edits are stored in-memory and in localStorage. To persist permanently, export and replace <code>src/data/projects.json</code>, then redeploy.
              </p>
              <button className="btn-secondary" type="button" onClick={handleExport}>
                Export JSON ↓
              </button>
            </div>
          </>
        )}
        {activeProject && (
          <ProjectEditor
            key={activeProject.id}
            project={activeProject}
            onSave={handleProjectSave}
            onDelete={handleProjectDelete}
          />
        )}
        {!activeProject && activeId !== '__profile__' && (
          <p className="admin-empty">Select a project from the sidebar or create a new one.</p>
        )}
      </div>
    </div>
  )
}

/* ─── Admin page root ───────────────────────────────────────────── */
export default function Admin({ data, onDataChange }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem('admin') === 'true')

  useEffect(() => {
    document.title = 'Admin — Portfolio'
  }, [])

  function handleLogin() {
    setAuthed(true)
  }

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <AdminPanel initialData={data} onDataChange={onDataChange} />
}
