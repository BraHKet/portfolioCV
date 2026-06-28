import { useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'

export default function Home({ data }) {
  const { profile, projects } = data

  useEffect(() => {
    document.title = profile.name
  }, [profile.name])

  const sorted = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  return (
    <main className="page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            {profile.photoUrl && (
              <div className="hero__photo-wrap">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="hero__photo"
                />
              </div>
            )}

            <div className="hero__text">
              <h1 className="hero__name">{profile.name}</h1>
              <p className="hero__title">{profile.title}</p>
              <p className="hero__bio">{profile.bio}</p>
              <div className="hero__links">
                {profile.github && (
                  <a
                    href={profile.github}
                    className="hero__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    className="hero__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="projects-section">
        <div className="container">
          <p className="projects-section__header">Selected work</p>
          <div className="projects-grid">
            {sorted.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__name">{profile.name}</span>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="footer__email">
              {profile.email}
            </a>
          )}
        </div>
      </footer>
    </main>
  )
}
