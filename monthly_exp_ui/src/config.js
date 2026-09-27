export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

// Base URL of the backend API. Empty string = same origin (uses the CRA dev
// proxy locally). In production (Vercel) set REACT_APP_API_BASE_URL to the
// Render backend URL, e.g. https://monthly-expense-api.onrender.com
export const API_BASE = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');

export const SESSION_STORAGE_KEY = 'mec.session';
// Auto-logout after 30 minutes of no user interaction.
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Consider the user "idle" for heartbeat reporting after 60s of no interaction.
export const IDLE_FLAG_MS = 60 * 1000;
// Heartbeat + live-count polling cadence.
export const HEARTBEAT_MS = 30 * 1000;
export const LIVE_COUNT_POLL_MS = 15 * 1000;
