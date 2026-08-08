import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.ft-root {
  --ink: #241F19;
  --paper: #F2EEE3;
  --accent: #C08A1E;
  --accent-soft: #F7E9C4;
  --font-display: 'Archivo Black', 'Arial Black', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-body);
  border-top: 2px solid var(--accent);
  margin-top: 60px;
}
.ft-root *, .ft-root *::before, .ft-root *::after { box-sizing: border-box; }
.ft-inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 40px 28px 28px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 32px;
}
.ft-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-display);
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 400;
  color: var(--paper);
  text-decoration: none;
  margin: 0 0 10px;
}
.ft-brand-icon { color: var(--accent); font-size: 15px; }
.ft-tagline { font-size: 13px; color: rgba(242, 238, 227, 0.65); line-height: 1.6; margin: 0; max-width: 280px; }
.ft-col-title {
  font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--accent-soft); margin: 0 0 14px;
}
.ft-links { display: flex; flex-direction: column; gap: 10px; }
.ft-link {
  color: rgba(242, 238, 227, 0.8); text-decoration: none; font-size: 13px; font-family: var(--font-body);
  transition: color .15s;
  width: fit-content;
}
.ft-link:hover { color: var(--accent-soft); }
.ft-note { font-size: 13px; color: rgba(242, 238, 227, 0.65); line-height: 1.6; margin: 0; }
.ft-bottom {
  border-top: 1px dashed rgba(242, 238, 227, 0.2);
  padding: 18px 28px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(242, 238, 227, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
@media (max-width: 640px) {
  .ft-inner { grid-template-columns: 1fr; gap: 28px; }
}
`;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="ft-root">
      <style>{STYLES}</style>

      <div className="ft-inner">
        <div>
          <Link to="/" className="ft-brand">
            <FaUtensils className="ft-brand-icon" /> NITKKR Craves
          </Link>
          <p className="ft-tagline">
            Honest reviews of every dish on campus, written by NIT Kurukshetra students, for NIT Kurukshetra students.
          </p>
        </div>

        <div>
          <p className="ft-col-title">Explore</p>
          <div className="ft-links">
            <Link to="/" className="ft-link">Home</Link>
            <Link to="/my-reviews" className="ft-link">My Reviews</Link>
            <Link to="/register" className="ft-link">Register</Link>
            <Link to="/login" className="ft-link">Login</Link>
          </div>
        </div>

        <div>
          <p className="ft-col-title">About</p>
          <p className="ft-note">
            Reviews are moderated before they go live, so what you see here has been checked by campus admins.
          </p>
        </div>
      </div>

      <div className="ft-bottom">© {year} NITKKR Craves — Built for NIT Kurukshetra students</div>
    </footer>
  );
};

export default Footer;