import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar({ profileName }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')

  function handleLogout() {
    sessionStorage.removeItem('admin')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          {profileName || 'Portfolio'}
        </Link>
        {isAdmin && (
          <button className="navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
