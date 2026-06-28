import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import TagPill from '../components/TagPill'
import ImageGallery from '../components/ImageGallery'

function toEmbedUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    // https://www.youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    // https://youtu.be/ID
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
  } catch {
    // not a valid URL — return as-is (user may have typed embed URL directly)
  }
  return url
}

export default function ProjectDetail({ data }) {
  const { id } = useParams()
  const project = data.projects.find(p => p.id === id)

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — ${data.profile.name}`
    }
  }, [project, data.profile.name])

  if (!project) return <Navigate to="/" replace />

  const {
    title, period, tags, imageUrl, images = [], videoUrl,
    fullDescription, results, repoUrl, liveUrl
  } = project

  const hasGallery = imageUrl || images.length > 0

  return (
    <main className="page-enter">
      <div className="container">
        <div className="project-detail">
          <Link to="/" className="project-detail__back">← Back</Link>

          {/* Title first, then media below */}
          <h1 className="project-detail__title">{title}</h1>

          {/* Meta row */}
          <div className="project-detail__meta">
            {period && (
              <span className="project-detail__period">{period}</span>
            )}
            {tags && tags.length > 0 && (
              <div className="project-detail__tags">
                {tags.map(tag => <TagPill key={tag} label={tag} />)}
              </div>
            )}
          </div>

          {/* Video embed */}
          {videoUrl && (
            <iframe
              className="project-detail__video"
              src={toEmbedUrl(videoUrl)}
              title={title}
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}

          {/* Image gallery — thumbnails, click to lightbox */}
          {hasGallery && (
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <p className="project-detail__section-label">Images</p>
              <ImageGallery imageUrl={imageUrl} images={images} />
            </div>
          )}

          {/* Full description */}
          {fullDescription && (
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <p className="project-detail__section-label">Overview</p>
              <p className="project-detail__description">{fullDescription}</p>
            </div>
          )}

          {/* Results */}
          {results && results.length > 0 && (
            <div className="project-detail__results">
              <p className="project-detail__section-label">Key results</p>
              <ul className="project-detail__results-list">
                {results.map((r, i) => (
                  <li key={i} className="project-detail__result-item">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action links */}
          {(repoUrl || liveUrl) && (
            <div className="project-detail__links">
              {repoUrl && (
                <a
                  href={repoUrl}
                  className="project-detail__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View repository ↗
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  className="project-detail__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
