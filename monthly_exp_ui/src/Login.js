import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID, API_BASE } from './config';
import './Login.css';

function Login({ onLogin }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // SMS OTP state
  const [mode, setMode] = useState('google'); // 'google' | 'phone'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'code'
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpInfo, setOtpInfo] = useState('');

  useEffect(() => {
    if (mode !== 'google') {
      return undefined;
    }
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID is not configured. Add REACT_APP_GOOGLE_CLIENT_ID to monthly_exp_ui/.env and restart.');
      return undefined;
    }

    let cancelled = false;

    const handleCredential = async (response) => {
      setBusy(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/auth/google`, {
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
  }, [onLogin, mode]);

  const requestOtp = async (event) => {
    event.preventDefault();
    setOtpBusy(true);
    setOtpError('');
    setOtpInfo('');
    try {
      const res = await fetch(`${API_BASE}/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Could not send the code.');
      }
      setOtpStep('code');
      if (data.devMode && data.devCode) {
        setOtpInfo(`Dev mode (SMS not configured): your code is ${data.devCode}`);
      } else {
        setOtpInfo(`We sent a 6-digit code to ${phone.trim()}.`);
      }
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpBusy(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setOtpBusy(true);
    setOtpError('');
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code.');
      }
      onLogin(data);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpBusy(false);
    }
  };

  const resetPhoneFlow = () => {
    setOtpStep('phone');
    setCode('');
    setOtpError('');
    setOtpInfo('');
  };

  return (
    <div className="login-shell">
      <div className="login-floaties" aria-hidden="true">
        {['\u{1F35B}', '\u{1F6D2}', '\u{1F457}', '\u{1F355}', '\u{1F951}', '\u{1F45F}', '\u2615', '\u{1F34E}', '\u{1F9FE}', '\u{1F354}', '\u{1F6CD}\uFE0F', '\u{1F966}'].map((emoji, index) => (
          <span key={`${emoji}-${index}`} className={`login-floatie lf-${index % 6}`}>
            {emoji}
          </span>
        ))}
      </div>

      <div className="login-card">
        <p className="login-eyebrow">Monthly Expense Calculator</p>
        <h1>Welcome {'\u{1F44B}'}</h1>
        <p className="login-sub">
          Sign in to track your spending, auto-tag items with live photos, and review monthly and yearly
          totals.
        </p>

        <div className="login-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'google'}
            className={`login-tab ${mode === 'google' ? 'active' : ''}`}
            onClick={() => {
              setMode('google');
              setError('');
            }}
          >
            Google
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'phone'}
            className={`login-tab ${mode === 'phone' ? 'active' : ''}`}
            onClick={() => {
              setMode('phone');
              resetPhoneFlow();
            }}
          >
            Phone OTP
          </button>
        </div>

        {mode === 'google' ? (
          <>
            <div className="google-btn-wrap" ref={buttonRef} />
            {busy ? <p className="login-status">Signing you in{'\u2026'}</p> : null}
            {error ? <p className="login-error">{error}</p> : null}
          </>
        ) : (
          <div className="otp-panel">
            {otpStep === 'phone' ? (
              <form onSubmit={requestOtp} className="otp-form">
                <label htmlFor="otp-phone">Phone number</label>
                <input
                  id="otp-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+14155552671"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
                <button type="submit" className="otp-btn" disabled={otpBusy}>
                  {otpBusy ? 'Sending\u2026' : 'Send code'}
                </button>
                <p className="otp-hint">Use international format with country code.</p>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="otp-form">
                <label htmlFor="otp-code">Enter the 6-digit code</label>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                  required
                />
                <button type="submit" className="otp-btn" disabled={otpBusy}>
                  {otpBusy ? 'Verifying\u2026' : 'Verify & sign in'}
                </button>
                <button type="button" className="otp-link" onClick={resetPhoneFlow}>
                  {'\u2190'} Use a different number
                </button>
              </form>
            )}
            {otpInfo ? <p className="login-status">{otpInfo}</p> : null}
            {otpError ? <p className="login-error">{otpError}</p> : null}
          </div>
        )}

        <p className="login-note">Your session auto-locks after 30 minutes of inactivity.</p>
      </div>
    </div>
  );
}

export default Login;
