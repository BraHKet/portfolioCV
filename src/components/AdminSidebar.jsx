export default function AdminSidebar({ projects, activeId, onSelect, onNew }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__section">
        <p className="admin-sidebar__label">Profile</p>
        <button
          className={`admin-sidebar__item ${activeId === '__profile__' ? 'admin-sidebar__item--active' : ''}`}
          onClick={() => onSelect('__profile__')}
        >
          Edit profile
        </button>
      </div>

      <hr className="admin-sidebar__divider" />

      <div className="admin-sidebar__section">
        <p className="admin-sidebar__label">Projects</p>
        {projects.map(p => (
          <button
            key={p.id}
            className={`admin-sidebar__item ${activeId === p.id ? 'admin-sidebar__item--active' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            {p.title || 'Untitled'}
          </button>
        ))}
      </div>

      <button className="admin-sidebar__new" onClick={onNew}>
        + New project
      </button>
    </aside>
  )
}
