import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaBars, FaTimes, FaUtensils } from 'react-icons/fa';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.nb-root {
  --ink: #241F19;
  --paper: #F2EEE3;
  --accent: #C08A1E;
  --accent-dark: #8C6314;
  --accent-soft: #F7E9C4;
  --danger: #A3291F;
  --font-display: 'Archivo Black', 'Arial Black', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  position: sticky;
  top: 0;
  z-index: 500;
  font-family: var(--font-body);
}
.nb-root *, .nb-root *::before, .nb-root *::after { box-sizing: border-box; }
.nb-bar {
  background: var(--ink);
  color: var(--paper);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 0 var(--accent);
  position: relative;
}
.nb-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--paper);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 17px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 400;
  flex-shrink: 0;
}
.nb-logo-icon { color: var(--accent); font-size: 16px; }
.nb-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--paper);
  cursor: pointer;
  padding: 4px;
}
.nb-links {
  display: flex;
  align-items: center;
  gap: 26px;
}
.nb-link {
  color: var(--paper);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  opacity: 0.85;
  transition: opacity .15s, border-color .15s, color .15s;
  white-space: nowrap;
}
.nb-link:hover { opacity: 1; }
.nb-link-active { opacity: 1; border-color: var(--accent); }
.nb-link-admin { color: var(--accent-soft); }
.nb-link-admin.nb-link-active { border-color: var(--accent-soft); }
.nb-logout {
  background: transparent;
  border: 1.5px solid var(--paper);
  color: var(--paper);
  padding: 7px 14px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
  white-space: nowrap;
}
.nb-logout:hover { background: var(--danger); border-color: var(--danger); color: #fff; }
.nb-cta {
  background: var(--accent);
  border: 1.5px solid var(--accent);
  color: var(--ink);
  padding: 7px 16px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: background .15s, border-color .15s;
  white-space: nowrap;
}
.nb-cta:hover { background: var(--accent-dark); border-color: var(--accent-dark); }

@media (max-width: 720px) {
  .nb-toggle { display: block; }
  .nb-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--ink);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0 28px;
    max-height: 0;
    overflow: hidden;
    transition: max-height .2s ease, padding .2s ease;
  }
  .nb-links-open {
    max-height: 360px;
    padding: 12px 28px 20px;
  }
  .nb-link {
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid rgba(242, 238, 227, 0.15);
  }
  .nb-logout, .nb-cta {
    width: 100%;
    margin-top: 10px;
    text-align: center;
  }
}
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.log(err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path;
  const linkClass = (path, extra = '') =>
    `nb-link ${extra} ${isActive(path) ? 'nb-link-active' : ''}`.trim();

  return (
    <nav className="nb-root">
      <style>{STYLES}</style>

      <div className="nb-bar">
        <Link to="/" className="nb-logo" onClick={closeMenu}>
          <FaUtensils className="nb-logo-icon" /> NITKKR Craves
        </Link>

        <button
          type="button"
          className="nb-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>

        <div className={`nb-links ${menuOpen ? 'nb-links-open' : ''}`}>
          <Link to="/" className={linkClass('/')} onClick={closeMenu}>
            Home
          </Link>

          {token ? (
            <>
              <Link to="/my-reviews" className={linkClass('/my-reviews')} onClick={closeMenu}>
                My Reviews
              </Link>

              {role === 'admin' && (
                <Link to="/admin" className={linkClass('/admin', 'nb-link-admin')} onClick={closeMenu}>
                  Admin
                </Link>
              )}

              <button type="button" className="nb-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="nb-cta" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;