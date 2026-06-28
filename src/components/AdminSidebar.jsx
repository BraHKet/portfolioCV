export default function AdminSidebar({ projects, activeId, onSelect, onNew, onReorder }) {
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
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`admin-sidebar__row ${activeId === p.id ? 'admin-sidebar__row--active' : ''}`}
          >
            <button
              className="admin-sidebar__item-title"
              onClick={() => onSelect(p.id)}
            >
              {p.title || 'Untitled'}
            </button>
            <div className="admin-sidebar__arrows">
              <button
                className="admin-sidebar__arrow"
                onClick={() => onReorder(p.id, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                className="admin-sidebar__arrow"
                onClick={() => onReorder(p.id, 1)}
                disabled={i === projects.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="admin-sidebar__new" onClick={onNew}>
        + New project
      </button>
    </aside>
  )
}
