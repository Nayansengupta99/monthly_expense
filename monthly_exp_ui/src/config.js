export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

export const SESSION_STORAGE_KEY = 'mec.session';
// Auto-logout after 30 minutes of no user interaction.
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Consider the user "idle" for heartbeat reporting after 60s of no interaction.
export const IDLE_FLAG_MS = 60 * 1000;
// Heartbeat + live-count polling cadence.
export const HEARTBEAT_MS = 30 * 1000;
export const LIVE_COUNT_POLL_MS = 15 * 1000;
