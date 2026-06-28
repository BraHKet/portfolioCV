import { Link } from 'react-router-dom'
import TagPill from './TagPill'

export default function ProjectCard({ project }) {
  const { id, title, shortDescription, tags, imageUrl, period } = project

  return (
    <Link to={`/projects/${id}`} className="project-card">
      <div className="project-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <div className="project-card__placeholder">
            <span className="project-card__placeholder-text">No image</span>
          </div>
        )}
      </div>
      <div className="project-card__body">
        {period && <p className="project-card__period">{period}</p>}
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__desc">{shortDescription}</p>
        {tags && tags.length > 0 && (
          <div className="project-card__tags">
            {tags.map(tag => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
