import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID } from './config';
import './Login.css';

function Login({ onLogin }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID is not configured. Add REACT_APP_GOOGLE_CLIENT_ID to monthly_exp_ui/.env and restart.');
      return;
    }

    let cancelled = false;

    const handleCredential = async (response) => {
      setBusy(true);
      setError('');
      try {
        const res = await fetch('/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: response.credential }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Google sign-in failed.');
        }
        const data = await res.json();
        onLogin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    };

    const init = () => {
      if (cancelled || !window.google?.accounts?.id) {
        return false;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
      });
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 280,
        });
      }
      return true;
    };

    if (!init()) {
      const timer = setInterval(() => {
        if (init()) {
          clearInterval(timer);
        }
      }, 300);
      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [onLogin]);

  return (
    <div className="login-shell">
      <div className="login-floaties" aria-hidden="true">
        {['🍛', '🛒', '👗', '🍕', '🥑', '👟', '☕', '🍎', '🧾', '🍔', '🛍️', '🥦'].map((emoji, index) => (
          <span key={`${emoji}-${index}`} className={`login-floatie lf-${index % 6}`}>
            {emoji}
          </span>
        ))}
      </div>

      <div className="login-card">
        <p className="login-eyebrow">Monthly Expense Calculator</p>
        <h1>Welcome 👋</h1>
        <p className="login-sub">
          Sign in with Google to track your spending, auto-tag items with live photos, and review monthly
          and yearly totals.
        </p>

        <div className="google-btn-wrap" ref={buttonRef} />

        {busy ? <p className="login-status">Signing you in…</p> : null}
        {error ? <p className="login-error">{error}</p> : null}

        <p className="login-note">Your session auto-locks after 30 minutes of inactivity.</p>
      </div>
    </div>
  );
}

export default Login;
