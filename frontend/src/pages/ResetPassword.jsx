import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import API from '../utils/api';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.auth-root {
  --paper: #F2EEE3;
  --surface: #FFFDF8;
  --border: #DED5BF;
  --border-strong: #C7BB9E;
  --ink: #241F19;
  --ink-muted: #746B5C;
  --accent: #C08A1E;
  --accent-dark: #8C6314;
  --accent-soft: #F7E9C4;
  --success: #2F7D4F;
  --success-soft: #E1EFE3;
  --danger: #A3291F;
  --danger-soft: #F2DEDA;
  --font-display: 'Archivo Black', 'Arial Black', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper);
  background-image: radial-gradient(circle, rgba(36,31,25,0.05) 1px, transparent 1px);
  background-size: 22px 22px;
  font-family: var(--font-body);
  color: var(--ink);
  padding: 24px;
  box-sizing: border-box;
}
.auth-root *, .auth-root *::before, .auth-root *::after { box-sizing: border-box; }
.auth-card {
  width: 100%;
  max-width: 380px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  box-shadow: 4px 4px 0 var(--border-strong);
  padding: 32px 28px;
}
.auth-header { text-align: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed var(--border-strong); }
.auth-header h1 {
  font-family: var(--font-display); font-size: 22px; font-weight: 400; text-transform: uppercase;
  letter-spacing: 0.03em; margin: 0 0 8px;
}
.auth-header p { font-size: 12px; color: var(--ink-muted); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }
.auth-error {
  background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger);
  padding: 10px 14px; border-radius: 2px; font-size: 13px; margin-bottom: 18px; font-weight: 600;
}
.auth-success {
  background: var(--success-soft); color: var(--success); border: 1.5px solid var(--success);
  padding: 12px 14px; border-radius: 2px; font-size: 13px; margin-bottom: 4px; font-weight: 600; line-height: 1.5;
}
.auth-form { display: flex; flex-direction: column; gap: 18px; }
.auth-field { display: flex; flex-direction: column; gap: 6px; }
.auth-field label {
  font-size: 11px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase;
  letter-spacing: 0.06em; font-family: var(--font-mono);
}
.auth-input-group, .auth-password-wrap {
  display: flex; align-items: center; border: 1px solid var(--border-strong); border-radius: 2px;
  background: #fff; transition: border-color .15s, box-shadow .15s;
}
.auth-input-group:focus-within, .auth-password-wrap:focus-within {
  border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft);
}
.auth-input-group input, .auth-password-wrap input {
  flex: 1; border: none; outline: none; padding: 10px 12px; font-size: 14px; font-family: var(--font-body);
  background: transparent; color: var(--ink); min-width: 0; width: 100%;
}
.auth-toggle {
  border: none; background: transparent; cursor: pointer; color: var(--ink-muted); padding: 0 12px;
  display: flex; align-items: center; height: 100%;
}
.auth-toggle:hover { color: var(--ink); }
.auth-btn {
  padding: 12px; border: 1.5px solid var(--ink); border-radius: 2px; background: var(--ink); color: #fff;
  font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer;
  font-family: var(--font-mono); transition: background .15s, transform .1s;
}
.auth-btn:hover:not(:disabled) { background: var(--accent-dark); border-color: var(--accent-dark); }
.auth-btn:active:not(:disabled) { transform: translateY(1px) scale(0.99); }
.auth-btn:disabled { opacity: .6; cursor: not-allowed; }
.auth-back {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-muted);
  text-decoration: none; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px;
}
.auth-back:hover { color: var(--ink); }
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'This reset link is invalid or has expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{STYLES}</style>

      <div className="auth-card">
        <Link to="/login" className="auth-back">
          <FaArrowLeft /> Back to login
        </Link>

        <div className="auth-header">
          <h1>Set New Password</h1>
          <p>Choose a new password for your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success ? (
          <div className="auth-success">Password updated. Redirecting you to login…</div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="new-password">New password</label>
              <div className="auth-password-wrap">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirm-password">Confirm password</label>
              <div className="auth-password-wrap">
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
