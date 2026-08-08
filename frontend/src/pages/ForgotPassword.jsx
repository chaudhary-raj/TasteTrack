import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import API from '../utils/api';

const EMAIL_DOMAIN = '@nitkkr.ac.in';

function buildEmail(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  return trimmed.includes('@') ? trimmed : `${trimmed}${EMAIL_DOMAIN}`;
}

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
  padding: 12px 14px; border-radius: 2px; font-size: 13px; margin-bottom: 18px; font-weight: 600; line-height: 1.5;
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
.auth-input-group input.auth-otp-input { letter-spacing: 0.3em; font-family: var(--font-mono); font-weight: 600; text-align: center; }
.auth-suffix {
  padding: 10px 12px 10px 0; font-size: 13px; color: var(--ink-muted); font-family: var(--font-mono); white-space: nowrap;
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
.auth-btn-ghost {
  background: transparent; color: var(--ink-muted); border: 1.5px solid var(--border-strong);
  padding: 10px; border-radius: 2px; font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; cursor: pointer; font-family: var(--font-mono);
}
.auth-btn-ghost:hover:not(:disabled) { color: var(--ink); border-color: var(--ink); }
.auth-btn-ghost:disabled { opacity: .6; cursor: not-allowed; }
.auth-meta-row { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--ink-muted); font-family: var(--font-mono); }
.auth-meta-row button {
  background: none; border: none; color: var(--accent-dark); font-weight: 600; cursor: pointer; font-family: var(--font-mono); font-size: 12px; padding: 0;
}
.auth-meta-row button:hover { text-decoration: underline; }
.auth-meta-row button:disabled { color: var(--ink-muted); cursor: not-allowed; text-decoration: none; }
.auth-back {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-muted);
  text-decoration: none; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px;
  background: none; border: none; cursor: pointer; padding: 0;
}
.auth-back:hover { color: var(--ink); }
`;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'done'
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState(''); // locked in once the code is sent
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const requestCode = async (targetEmail) => {
    await API.post('/auth/forgot-password', { email: targetEmail });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const builtEmail = buildEmail(rollNumber);
    if (!builtEmail) {
      setError('Please enter your roll number.');
      return;
    }

    setLoading(true);
    try {
      await requestCode(builtEmail);
      setEmail(builtEmail);
      setStep('reset');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await requestCode(email);
    } catch (err) {
      setError(
        err.response?.data?.error || err.response?.data?.message || 'Could not resend the code.'
      );
    } finally {
      setResending(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the code we sent you.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, otp: otp.trim(), newPassword });
      setStep('done');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Invalid or expired code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{STYLES}</style>

      <div className="auth-card">
        {step === 'request' && (
          <>
            <Link to="/login" className="auth-back">
              <FaArrowLeft /> Back to login
            </Link>
            <div className="auth-header">
              <h1>Reset Password</h1>
              <p>We'll email you a verification code</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleRequestSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="roll-number">Roll number</label>
                <div className="auth-input-group">
                  <input
                    id="roll-number"
                    type="text"
                    placeholder="e.g. 22103135"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    autoComplete="username"
                  />
                  <span className="auth-suffix">{EMAIL_DOMAIN}</span>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Sending…' : 'Send Code'}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <button type="button" className="auth-back" onClick={() => setStep('request')}>
              <FaArrowLeft /> Use a different roll number
            </button>
            <div className="auth-header">
              <h1>Enter Code</h1>
              <p>Sent to {email}</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleResetSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="otp">Verification code</label>
                <div className="auth-input-group">
                  <input
                    id="otp"
                    className="auth-otp-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="••••••"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="new-password">New password</label>
                <div className="auth-password-wrap">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>

              <div className="auth-meta-row">
                <span>Didn't get a code?</span>
                <button type="button" onClick={handleResend} disabled={resending}>
                  {resending ? 'Resending…' : 'Resend'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'done' && (
          <>
            <div className="auth-header">
              <h1>All Set</h1>
            </div>
            <div className="auth-success">Password updated. Redirecting you to login…</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
