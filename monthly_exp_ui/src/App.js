import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import Login from './Login';
import {
  SESSION_STORAGE_KEY,
  IDLE_TIMEOUT_MS,
  IDLE_FLAG_MS,
  HEARTBEAT_MS,
  LIVE_COUNT_POLL_MS,
  API_BASE,
} from './config';

const PAGE_SIZE = 6;

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const visualCatalog = [
  { label: 'Biryani', emoji: '🍛', colors: ['#ff7a18', '#ff3d7f'], keywords: ['biryani', 'biriyani', 'briyani', 'dum biryani', 'pulao', 'pulav', 'kebab', 'kabab', 'mutton', 'chicken rice', 'fried rice'] },
  { label: 'Pizza', emoji: '🍕', colors: ['#ff9f1c', '#ff5f6d'], keywords: ['pizza', 'margherita', 'pepperoni', 'dominos', 'pizzahut'] },
  { label: 'Burger', emoji: '🍔', colors: ['#f59e0b', '#f97316'], keywords: ['burger', 'cheeseburger', 'fries', 'sandwich', 'mcdonald', 'kfc', 'wrap'] },
  { label: 'Noodles', emoji: '🍜', colors: ['#f97316', '#ea580c'], keywords: ['noodles', 'ramen', 'maggi', 'pasta', 'chowmein', 'chow mein', 'hakka'] },
  { label: 'Coffee', emoji: '☕', colors: ['#7c3aed', '#ec4899'], keywords: ['coffee', 'latte', 'cappuccino', 'espresso', 'mocha', 'starbucks', 'americano'] },
  { label: 'Tea', emoji: '🍵', colors: ['#0ea5e9', '#14b8a6'], keywords: ['tea', 'chai', 'green tea', 'milk tea'] },
  { label: 'Drinks', emoji: '🥤', colors: ['#ef4444', '#f97316'], keywords: ['juice', 'soda', 'coke', 'pepsi', 'drink', 'drinks', 'cola', 'shake', 'smoothie', 'lassi'] },
  { label: 'Alcohol', emoji: '🍺', colors: ['#d97706', '#b45309'], keywords: ['beer', 'wine', 'whisky', 'whiskey', 'alcohol', 'vodka', 'rum', 'bar', 'pub'] },
  { label: 'Groceries', emoji: '🛒', colors: ['#10b981', '#22c55e'], keywords: ['grocery', 'groceries', 'supermarket', 'market', 'bigbasket', 'dmart', 'provisions'] },
  { label: 'Fruits', emoji: '🍎', colors: ['#22c55e', '#84cc16'], keywords: ['fruit', 'fruits', 'apple', 'banana', 'mango', 'grapes', 'orange', 'watermelon'] },
  { label: 'Vegetables', emoji: '🥦', colors: ['#16a34a', '#0f766e'], keywords: ['vegetable', 'vegetables', 'veggie', 'veg', 'spinach', 'tomato', 'onion', 'potato', 'sabzi'] },
  { label: 'Milk', emoji: '🥛', colors: ['#38bdf8', '#0ea5e9'], keywords: ['milk', 'dairy', 'curd', 'yogurt', 'butter', 'cheese', 'paneer', 'ghee'] },
  { label: 'Dessert', emoji: '🍰', colors: ['#f472b6', '#ec4899'], keywords: ['cake', 'dessert', 'sweet', 'sweets', 'ice cream', 'icecream', 'pastry', 'chocolate', 'donut', 'mithai'] },
  { label: 'Fuel', emoji: '⛽', colors: ['#2563eb', '#0ea5e9'], keywords: ['fuel', 'petrol', 'diesel', 'gas', 'refuel', 'cng'] },
  { label: 'Travel', emoji: '🚕', colors: ['#06b6d4', '#3b82f6'], keywords: ['travel', 'taxi', 'cab', 'uber', 'ola', 'bus', 'metro', 'ride', 'flight', 'train', 'auto', 'ticket'] },
  { label: 'Shopping', emoji: '🛍️', colors: ['#fb7185', '#f43f5e'], keywords: ['shopping', 'clothes', 'shirt', 'tshirt', 'jeans', 'dress', 'shoes', 'mall', 'fashion', 'myntra', 'amazon', 'flipkart'] },
  { label: 'Electronics', emoji: '📱', colors: ['#6366f1', '#8b5cf6'], keywords: ['mobile', 'phone', 'iphone', 'laptop', 'charger', 'earphone', 'headphone', 'electronics', 'device', 'tv', 'gadget'] },
  { label: 'Home', emoji: '🏠', colors: ['#8b5cf6', '#4f46e5'], keywords: ['rent', 'home', 'house', 'furniture', 'maintenance', 'repair'] },
  { label: 'Bills', emoji: '🧾', colors: ['#0ea5e9', '#6366f1'], keywords: ['electricity', 'wifi', 'internet', 'bill', 'bills', 'recharge', 'water bill', 'gas bill', 'broadband', 'dth'] },
  { label: 'Health', emoji: '💊', colors: ['#22c55e', '#16a34a'], keywords: ['medicine', 'medicines', 'doctor', 'clinic', 'pharmacy', 'health', 'hospital', 'tablet', 'checkup'] },
  { label: 'Toiletries', emoji: '🪥', colors: ['#06b6d4', '#0ea5e9'], keywords: ['brush', 'toothbrush', 'toothpaste', 'soap', 'shampoo', 'toiletries', 'sanitizer', 'tissue', 'detergent', 'towel'] },
  { label: 'Entertainment', emoji: '🎬', colors: ['#a855f7', '#ec4899'], keywords: ['movie', 'cinema', 'game', 'games', 'entertainment', 'netflix', 'spotify', 'concert', 'subscription'] },
  { label: 'Office', emoji: '💼', colors: ['#64748b', '#1d4ed8'], keywords: ['office', 'work', 'stationery', 'printer', 'meeting', 'pen', 'notebook'] },
  { label: 'Education', emoji: '📚', colors: ['#0f766e', '#14b8a6'], keywords: ['school', 'college', 'book', 'books', 'fees', 'education', 'course', 'tuition', 'exam'] },
  { label: 'Beauty', emoji: '💄', colors: ['#db2777', '#8b5cf6'], keywords: ['salon', 'spa', 'beauty', 'haircut', 'makeup', 'cosmetics', 'parlour'] },
  { label: 'Gym', emoji: '🏋️', colors: ['#f97316', '#ef4444'], keywords: ['gym', 'workout', 'fitness', 'sports', 'protein', 'yoga', 'cricket', 'football'] },
  { label: 'Gift', emoji: '🎁', colors: ['#f59e0b', '#db2777'], keywords: ['gift', 'present', 'birthday', 'celebration', 'anniversary'] },
  { label: 'Pet', emoji: '🐾', colors: ['#38bdf8', '#6366f1'], keywords: ['pet', 'dog', 'cat', 'animal', 'vet', 'petfood'] },
  { label: 'Generic', emoji: '💰', colors: ['#6366f1', '#0ea5e9'], keywords: [] },
];

const keywordIndex = visualCatalog.flatMap((entry) =>
  entry.keywords.map((keyword) => ({ keyword, entry }))
);

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

function makeDataUrl({ emoji, label, colors }) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </linearGradient>
        <radialGradient id="gloss" cx="30%" cy="24%" r="70%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
          <stop offset="45%" stop-color="rgba(255,255,255,0.12)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>
      <rect x="0" y="0" width="140" height="140" rx="34" fill="url(#bg)"/>
      <rect x="0" y="0" width="140" height="140" rx="34" fill="url(#gloss)"/>
      <circle cx="112" cy="26" r="16" fill="rgba(255,255,255,0.16)"/>
      <circle cx="24" cy="34" r="9" fill="rgba(255,255,255,0.14)"/>
      <circle cx="30" cy="112" r="12" fill="rgba(255,255,255,0.12)"/>
      <circle cx="70" cy="62" r="40" fill="rgba(255,255,255,0.14)"/>
      <text x="70" y="80" text-anchor="middle" font-size="60" filter="url(#soft)" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${emoji}</text>
      <text x="70" y="122" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="0.5" fill="rgba(255,255,255,0.94)" font-family="Inter,Arial,sans-serif">${label.toUpperCase()}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

function predictCategory(text = '') {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return visualCatalog[visualCatalog.length - 1];
  }

  const tokens = cleaned.split(' ');
  const scores = new Map();
  const bump = (entry, amount) => scores.set(entry, (scores.get(entry) || 0) + amount);

  for (const { keyword, entry } of keywordIndex) {
    if (cleaned.includes(keyword)) {
      bump(entry, keyword.length + 12);
    }

    const keywordTokens = keyword.split(' ');
    for (const token of tokens) {
      if (token.length < 3) continue;
      for (const kwToken of keywordTokens) {
        if (kwToken.length < 3) continue;
        if (token === kwToken) {
          bump(entry, 10);
        } else if (token.includes(kwToken) || kwToken.includes(token)) {
          bump(entry, 6);
        } else if (Math.abs(token.length - kwToken.length) <= 2 && levenshtein(token, kwToken) <= 1) {
          bump(entry, 5);
        }
      }
    }
  }

  let best = visualCatalog[visualCatalog.length - 1];
  let bestScore = 0;
  for (const [entry, score] of scores) {
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best;
}

function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildPhotoUrl(itemName, categoryLabel) {
  const cleaned = (itemName || '').toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim();
  const primary = cleaned ? cleaned.split(' ').slice(0, 2).join(',') : '';
  const query = [primary, (categoryLabel || '').toLowerCase()].filter(Boolean).join(',') || 'expense';
  // LoremFlickr returns a real Flickr photo for the keywords. The lock keeps the
  // same photo stable for a given item instead of changing on every render.
  const lock = (hashString(query) % 900) + 1;
  return `https://loremflickr.com/240/240/${encodeURIComponent(query)}?lock=${lock}`;
}

function predictVisual(text = '') {
  const category = predictCategory(text);
  return {
    label: category.label,
    imageUrl: buildPhotoUrl(text, category.label),
    fallbackUrl: makeDataUrl(category),
    accent: `linear-gradient(135deg, ${category.colors[0]}, ${category.colors[1]})`,
  };
}

function normalizeItem(item) {
  const visual = predictVisual(item.itemName || '');

  return {
    ...item,
    visual,
  };
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [liveUsers, setLiveUsers] = useState(0);
  const lastActivityRef = useRef(Date.now());

  const handleLogin = useCallback((data) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    setSession(data);
    lastActivityRef.current = Date.now();
  }, []);

  const handleLogout = useCallback(
    (reason) => {
      const sessionId = session?.sessionId;
      if (sessionId) {
        // Use keepalive so the request survives the page state change.
        fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true,
        }).catch(() => {});
      }
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setSession(null);
      if (reason === 'idle') {
        // Small delay so state settles before the alert.
        setTimeout(() => window.alert('You were logged out after 30 minutes of inactivity.'), 50);
      }
    },
    [session]
  );

  // Track user interaction to know when the session is idle.
  useEffect(() => {
    if (!session) return undefined;
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((evt) => window.addEventListener(evt, markActive, { passive: true }));
    return () => events.forEach((evt) => window.removeEventListener(evt, markActive));
  }, [session]);

  // Heartbeat: report idle flag, and auto-logout past the idle timeout.
  useEffect(() => {
    if (!session?.sessionId) return undefined;

    const beat = () => {
      const idleFor = Date.now() - lastActivityRef.current;
      if (idleFor >= IDLE_TIMEOUT_MS) {
        handleLogout('idle');
        return;
      }
      fetch(`${API_BASE}/auth/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, idle: idleFor >= IDLE_FLAG_MS }),
      }).catch(() => {});
    };

    beat();
    const timer = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(timer);
  }, [session, handleLogout]);

  // Poll the accurate live-user count.
  useEffect(() => {
    if (!session) return undefined;
    const poll = () => {
      fetch(`${API_BASE}/auth/live-users`)
        .then((res) => (res.ok ? res.json() : { count: 0 }))
        .then((data) => setLiveUsers(data.count ?? 0))
        .catch(() => {});
    };
    poll();
    const timer = setInterval(poll, LIVE_COUNT_POLL_MS);
    return () => clearInterval(timer);
  }, [session]);

  // Log out cleanly when the tab/browser closes.
  useEffect(() => {
    if (!session?.sessionId) return undefined;
    const onUnload = () => {
      const payload = JSON.stringify({ sessionId: session.sessionId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${API_BASE}/auth/logout`, new Blob([payload], { type: 'application/json' }));
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [session]);

  const [expenseForm, setExpenseForm] = useState({
    itemName: '',
    price: '',
    timeStamp: '',
  });
  const [saveState, setSaveState] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState({ save: false, year: false, month: false });
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [monthYearInput, setMonthYearInput] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState(null);
  const [reportStatus, setReportStatus] = useState({ type: '', message: '' });
  const [reportPage, setReportPage] = useState(1);

  const totalPages = useMemo(() => {
    if (!reportSummary?.items?.length) {
      return 1;
    }
    return Math.max(1, Math.ceil(reportSummary.items.length / PAGE_SIZE));
  }, [reportSummary]);

  const visibleItems = useMemo(() => {
    if (!reportSummary?.items?.length) {
      return [];
    }
    const start = (reportPage - 1) * PAGE_SIZE;
    return reportSummary.items.slice(start, start + PAGE_SIZE);
  }, [reportPage, reportSummary]);

  const openReport = (title, summary) => {
    setReportTitle(title);
    setReportSummary(summary);
    setReportStatus({ type: 'success', message: `Loaded ${summary.items.length} expense${summary.items.length === 1 ? '' : 's'}.` });
    setReportPage(1);
    setReportOpen(true);
  };

  const handleSaveChange = (event) => {
    const { name, value } = event.target;
    setExpenseForm((current) => ({ ...current, [name]: value }));
  };

  const saveExpense = async (event) => {
    event.preventDefault();
    setLoading((current) => ({ ...current, save: true }));
    setSaveState({ type: '', message: '' });

    const visual = predictVisual(expenseForm.itemName);

    try {
      const response = await fetch(`${API_BASE}/expense/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': session?.sessionId || '',
        },
        body: JSON.stringify({
          itemName: expenseForm.itemName.trim(),
          price: Number(expenseForm.price),
          imageUrl: visual.imageUrl,
          ...(expenseForm.timeStamp ? { timeStamp: expenseForm.timeStamp } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to save expense.');
      }

      await response.json();
      setSaveState({ type: 'success', message: `Saved "${expenseForm.itemName}" with an auto-predicted image.` });
      setExpenseForm({ itemName: '', price: '', timeStamp: '' });
    } catch (error) {
      setSaveState({ type: 'error', message: error.message });
    } finally {
      setLoading((current) => ({ ...current, save: false }));
    }
  };

  const fetchYearSummary = async (event) => {
    event.preventDefault();
    setLoading((current) => ({ ...current, year: true }));
    setReportStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE}/expense?year=${yearInput}`, {
        headers: { 'X-Session-Id': session?.sessionId || '' },
      });
      if (!response.ok) {
        throw new Error('Unable to load yearly summary.');
      }

      const data = await response.json();
      openReport(`Yearly summary for ${data.year}`, {
        scope: 'year',
        period: data.year,
        total: data.totalYearlyExpense,
        items: (data.itemModels || []).map(normalizeItem),
      });
    } catch (error) {
      setReportStatus({ type: 'error', message: error.message });
      setReportOpen(true);
      setReportTitle('Yearly summary');
      setReportSummary(null);
    } finally {
      setLoading((current) => ({ ...current, year: false }));
    }
  };

  const fetchMonthSummary = async (event) => {
    event.preventDefault();
    setLoading((current) => ({ ...current, month: true }));
    setReportStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE}/expense?year=${monthYearInput}`, {
        headers: { 'X-Session-Id': session?.sessionId || '' },
      });
      if (!response.ok) {
        throw new Error('Unable to load month summary.');
      }

      const data = await response.json();
      const monthNumber = Number(monthInput);
      const filteredItems = (data.itemModels || [])
        .filter((item) => new Date(item.timeStamp).getMonth() + 1 === monthNumber)
        .map(normalizeItem);
      const total = filteredItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

      openReport(`Monthly summary for ${monthNames[monthNumber - 1]} ${monthYearInput}`, {
        scope: 'month',
        period: `${monthNames[monthNumber - 1]} ${monthYearInput}`,
        total,
        items: filteredItems,
      });
    } catch (error) {
      setReportStatus({ type: 'error', message: error.message });
      setReportOpen(true);
      setReportTitle('Monthly summary');
      setReportSummary(null);
    } finally {
      setLoading((current) => ({ ...current, month: false }));
    }
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="floaties" aria-hidden="true">
        {['🍛', '🛒', '👗', '🍕', '🥑', '👟', '☕', '🍎', '🧾', '🍔', '🛍️', '🥦', '🧥', '🍰', '🥛', '👜'].map((emoji, index) => (
          <span key={`${emoji}-${index}`} className={`floatie floatie-${index % 8}`}>
            {emoji}
          </span>
        ))}
      </div>

      <header className="topbar">
        <div className="live-badge" title="Users active in the last 60 seconds">
          <span className="live-dot" />
          {liveUsers} {liveUsers === 1 ? 'user' : 'users'} live
        </div>
        <div className="user-chip">
          {session.user?.picture ? (
            <img src={session.user.picture} alt={session.user?.name || 'User'} referrerPolicy="no-referrer" />
          ) : (
            <span className="user-avatar">{(session.user?.name || 'U').charAt(0).toUpperCase()}</span>
          )}
          <span className="user-name">{session.user?.name || session.user?.email}</span>
          <button type="button" className="logout-btn" onClick={() => handleLogout('manual')}>
            Logout
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Monthly Expense Calculator</p>
          <h1>Track every spend with a polished, mobile-ready dashboard.</h1>
          <p>
            Save expenses, auto-predict a matching image from the item name, and review month or year
            totals in a separate paginated window.
          </p>
        </div>

        <div className="hero-grid">
          <article className="hero-card primary">
            <span>Auto visual prediction</span>
            <strong>AI-style image picker</strong>
            <p>Keywords like biryani, coffee, rent, or fuel generate a matching visual automatically.</p>
          </article>
          <article className="hero-card">
            <span>Yearly total</span>
            <strong>Quick summary</strong>
            <p>Pull all expenses for a chosen year and review the total instantly.</p>
          </article>
          <article className="hero-card">
            <span>Monthly total</span>
            <strong>Focused lookup</strong>
            <p>Filter by month and year for a cleaner month-by-month expense view.</p>
          </article>
        </div>
      </section>

      <section className="workspace">
        <div className="glass-card">
          <div className="section-heading">
            <div>
              <p className="section-label">Save expense</p>
              <h2>Enter the item once and let the app tag it visually.</h2>
            </div>
            <div className="mini-pill">Saved image preview is auto-generated</div>
          </div>

          <form className="expense-form" onSubmit={saveExpense}>
            <label>
              Item name
              <input
                name="itemName"
                type="text"
                value={expenseForm.itemName}
                onChange={handleSaveChange}
                placeholder="Biryani, rent, fuel..."
                required
              />
            </label>
            <div className="split-row">
              <label>
                Amount
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenseForm.price}
                  onChange={handleSaveChange}
                  placeholder="1500"
                  required
                />
              </label>
              <label>
                Date & time
                <input
                  name="timeStamp"
                  type="datetime-local"
                  value={expenseForm.timeStamp}
                  onChange={handleSaveChange}
                />
              </label>
            </div>
            <button className="primary-btn" type="submit" disabled={loading.save}>
              {loading.save ? 'Saving...' : 'Save expense'}
            </button>
          </form>
          {saveState.message ? <p className={`feedback ${saveState.type}`}>{saveState.message}</p> : null}
        </div>

        <div className="glass-card">
          <div className="section-heading">
            <div>
              <p className="section-label">Look up totals</p>
              <h2>Open summaries in a separate drawer.</h2>
            </div>
          </div>

          <div className="query-grid">
            <form className="query-card" onSubmit={fetchYearSummary}>
              <h3>Yearly total</h3>
              <p>Show everything spent in a chosen year.</p>
              <input
                type="number"
                min="1900"
                max="2100"
                value={yearInput}
                onChange={(event) => setYearInput(event.target.value)}
                placeholder="2025"
                required
              />
              <button className="secondary-btn" type="submit" disabled={loading.year}>
                {loading.year ? 'Loading...' : 'Open year summary'}
              </button>
            </form>

            <form className="query-card" onSubmit={fetchMonthSummary}>
              <h3>Monthly total</h3>
              <p>Filter by month and year for a focused lookup.</p>
              <div className="query-row">
                <select value={monthInput} onChange={(event) => setMonthInput(event.target.value)} required>
                  <option value="">Month</option>
                  {monthNames.map((name, index) => (
                    <option key={name} value={index + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={monthYearInput}
                  onChange={(event) => setMonthYearInput(event.target.value)}
                  placeholder="2025"
                  required
                />
              </div>
              <button className="secondary-btn" type="submit" disabled={loading.month}>
                {loading.month ? 'Loading...' : 'Open month summary'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {reportOpen ? <div className="drawer-backdrop" onClick={() => setReportOpen(false)} /> : null}

      <aside className={`drawer ${reportOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div>
            <p className="section-label">{reportTitle || 'Expense summary'}</p>
            <h2>{reportSummary ? reportSummary.period : 'No data loaded yet'}</h2>
          </div>
          <button className="icon-btn" type="button" onClick={() => setReportOpen(false)}>
            ✕
          </button>
        </div>

        {reportStatus.message ? <p className={`feedback ${reportStatus.type}`}>{reportStatus.message}</p> : null}

        {reportSummary ? (
          <>
            <div className="summary-grid">
              <article className="summary-stat">
                <span>Total expense</span>
                <strong>{formatMoney(reportSummary.total)}</strong>
              </article>
              <article className="summary-stat">
                <span>Items loaded</span>
                <strong>{reportSummary.items.length}</strong>
              </article>
              <article className="summary-stat">
                <span>Page</span>
                <strong>
                  {reportPage} / {totalPages}
                </strong>
              </article>
            </div>

            <div className="pager">
              <button
                className="pager-btn"
                type="button"
                onClick={() => setReportPage((page) => Math.max(1, page - 1))}
                disabled={reportPage === 1}
              >
                Previous
              </button>
              <span>
                Showing {(reportPage - 1) * PAGE_SIZE + 1}-{Math.min(reportPage * PAGE_SIZE, reportSummary.items.length)} of{' '}
                {reportSummary.items.length}
              </span>
              <button
                className="pager-btn"
                type="button"
                onClick={() => setReportPage((page) => Math.min(totalPages, page + 1))}
                disabled={reportPage >= totalPages}
              >
                Next
              </button>
            </div>

            <div className="item-list">
              {visibleItems.map((item) => (
                <article key={item.id || `${item.itemName}-${item.timeStamp}`} className="item-row">
                  <img
                    className="item-image"
                    src={item.visual?.imageUrl || predictVisual(item.itemName).imageUrl}
                    alt={item.itemName}
                    loading="lazy"
                    onError={(event) => {
                      const fallback = item.visual?.fallbackUrl || predictVisual(item.itemName).fallbackUrl;
                      if (event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="item-details">
                    <div className="item-topline">
                      <h3>{item.itemName}</h3>
                      <strong>{formatMoney(item.price)}</strong>
                    </div>
                    <span>{item.timeStamp ? new Date(item.timeStamp).toLocaleString() : 'No saved date'}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-report">
            <p>Run a yearly or monthly summary to open the separate results window.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
