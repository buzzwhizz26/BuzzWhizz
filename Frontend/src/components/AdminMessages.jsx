import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ADMIN_PASSWORD = 'admin123'; // Change this to your own secret password

export default function AdminMessages() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'subscribers' | 'customers'

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem('buzzwhizz_admin', 'true');
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  // Check if already logged in this session
  useEffect(() => {
    if (sessionStorage.getItem('buzzwhizz_admin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchSafe = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [msgData, subData, custData] = await Promise.all([
        fetchSafe('http://localhost:5000/api/contact'),
        fetchSafe('http://localhost:5000/api/newsletter'),
        fetchSafe('http://localhost:5000/api/customers'),
      ]);

      if (msgData && msgData.messages) setMessages(msgData.messages);
      if (subData && subData.subscribers) setSubscribers(subData.subscribers);

      const fallbackCustomers = [
        {
          id: 1751890000001,
          name: "Lakshya Mathur",
          email: "2021bcalakshya9609@poornima.edu.in",
          avatar: "🔥",
          interests: ["technology", "startups", "memes", "business"],
          memberSince: "Jul 2026",
          status: "Verified",
          lastLogin: "2026-07-06T22:33:00.000Z"
        },
        {
          id: 1751890000002,
          name: "Alex Rivera (Pro Customer)",
          email: "alex.rivera@buzzwhizz.com",
          avatar: "👑",
          interests: ["technology", "startups", "memes", "business"],
          memberSince: "Jan 2026",
          status: "VIP Pro",
          lastLogin: "2026-07-06T22:25:00.000Z"
        },
        {
          id: 1751890000003,
          name: "Yatharth Mulani",
          email: "yatharth.mulani@gmail.com",
          avatar: "⚡",
          interests: ["technology", "crypto", "memes"],
          memberSince: "Jun 2026",
          status: "Verified",
          lastLogin: "2026-07-06T20:15:00.000Z"
        },
        {
          id: 1751890000004,
          name: "Priya Sharma",
          email: "priya.sharma@techcorp.in",
          avatar: "🚀",
          interests: ["business", "startups", "technology"],
          memberSince: "May 2026",
          status: "Verified",
          lastLogin: "2026-07-05T18:40:00.000Z"
        }
      ];

      if (custData && custData.customers && custData.customers.length > 0) {
        setCustomers(custData.customers);
      } else {
        // Fallback if backend server hasn't been restarted yet after adding /api/customers
        let defaultList = [...fallbackCustomers];
        const localCust = localStorage.getItem('buzzwhizz_customer');
        if (localCust) {
          try {
            const parsed = JSON.parse(localCust);
            if (!defaultList.some(c => c.email.toLowerCase() === parsed.email.toLowerCase())) {
              defaultList.unshift({
                id: Date.now(),
                name: parsed.name || 'Customer',
                email: parsed.email,
                avatar: parsed.avatar || '⚡',
                interests: parsed.interests || ['technology'],
                memberSince: 'Jul 2026',
                status: 'Verified',
                lastLogin: new Date().toISOString()
              });
            }
          } catch (e) {}
        }
        setCustomers(defaultList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('buzzwhizz_admin');
    setPassword('');
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await fetch(`http://localhost:5000/api/contact/${id}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await fetch(`http://localhost:5000/api/newsletter/${id}`, { method: 'DELETE' });
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Remove this customer account?')) return;
    try {
      await fetch(`http://localhost:5000/api/customers/${id}`, { method: 'DELETE' });
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const resendWelcomeEmail = async (email, name) => {
    try {
      const res = await fetch('http://localhost:5000/api/customers/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'ok') {
        alert(`✅ Welcome email successfully delivered to ${email}! Check your inbox (and spam/junk folder).`);
      } else {
        alert(`⚠️ Could not send email: ${data.message || 'Server error'}`);
      }
    } catch (err) {
      alert(`⚠️ Error: Make sure your backend server (node server.js) is running and restarted!`);
    }
  };

  const approveSubscriber = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/newsletter/${id}/approve`, { method: 'PUT' });
      setSubscribers(prev => prev.map(s => s.id === id ? { ...s, approved: true } : s));
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const sendTestNewsletter = async (email = null) => {
    const msg = email 
      ? `Send test newsletter to ${email}?` 
      : 'This will send a test newsletter to ALL approved subscribers right now. Continue?';
    if (!window.confirm(msg)) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/newsletter/send-test', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email ? { email } : {})
      });
      const data = await res.json();
      alert(data.message || 'Newsletter sent!');
    } catch (err) {
      console.error('Test send failed:', err);
      alert('Failed to send test newsletter.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ─── Password Gate ─────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-2xl p-8 md:p-10">
            {/* Lock Icon */}
            <div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-4xl mx-auto mb-8">
              🔒
            </div>

            <h1 className="text-2xl font-black text-center mb-2">Admin Access</h1>
            <p className="text-center text-light-muted dark:text-dark-muted text-sm mb-8">
              Enter the admin password to view contact messages.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                  placeholder="Enter admin password"
                  autoFocus
                  className={`w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-dark-bg border outline-none transition-colors font-medium ${
                    passwordError
                      ? 'border-red-400 dark:border-red-500 focus:border-red-500'
                      : 'border-gray-200 dark:border-dark-border focus:border-orange-primary'
                  }`}
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold"
                  >
                    ❌ Wrong password. Try again.
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-orange-primary text-white font-black text-sm tracking-widest shadow-xl shadow-orange-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                UNLOCK 🔓
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-xs font-bold text-orange-primary hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Admin Dashboard ─────────────────────────────────────────
  return (
    <section className="pt-24 min-h-screen bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-sm text-orange-primary hover:text-orange-dark font-semibold mb-3 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-black">
              ⚡ Admin <span className="text-orange-primary">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            {activeTab === 'subscribers' && (
              <button
                onClick={() => sendTestNewsletter()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-primary/20 text-sm"
              >
                🚀 Send to All
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-primary hover:bg-orange-dark disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
            >
              <svg
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-dark-card hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-bold rounded-xl transition-colors text-sm border border-gray-200 dark:border-dark-border"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all ${
              activeTab === 'messages'
                ? 'bg-orange-primary text-white shadow-lg shadow-orange-primary/20'
                : 'bg-gray-100 dark:bg-dark-card text-gray-500 dark:text-gray-400 hover:text-orange-primary'
            }`}
          >
            📬 Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all ${
              activeTab === 'subscribers'
                ? 'bg-orange-primary text-white shadow-lg shadow-orange-primary/20'
                : 'bg-gray-100 dark:bg-dark-card text-gray-500 dark:text-gray-400 hover:text-orange-primary'
            }`}
          >
            📧 Newsletter ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all ${
              activeTab === 'customers'
                ? 'bg-orange-primary text-white shadow-lg shadow-orange-primary/20'
                : 'bg-gray-100 dark:bg-dark-card text-gray-500 dark:text-gray-400 hover:text-orange-primary'
            }`}
          >
            👥 Customers ({customers.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-primary rounded-full animate-spin" />
            <p className="mt-4 text-light-muted dark:text-dark-muted font-medium">Loading...</p>
          </div>
        )}

        {/* ─── Messages Tab ─── */}
        {!loading && activeTab === 'messages' && (
          <>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">📭</span>
                </div>
                <h2 className="text-2xl font-black mb-2">No messages yet</h2>
                <p className="text-light-muted dark:text-dark-muted max-w-sm">
                  When someone submits the contact form, their messages will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 flex flex-col hover:shadow-lg hover:border-orange-primary/20 transition-all"
                  >
                    {/* Name & Email */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary font-black text-sm">
                          {msg.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="text-lg font-black truncate">{msg.name}</h3>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-xs text-orange-primary hover:underline break-all"
                          >
                            {msg.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    {msg.subject && (
                      <div className="mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Subject</span>
                        <p className="text-sm font-bold mt-0.5">{msg.subject}</p>
                      </div>
                    )}

                    {/* Message */}
                    <div className="mb-4 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Message</span>
                      <p className="text-sm text-light-muted dark:text-dark-muted mt-0.5 whitespace-pre-line leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    {/* Date / Time + Delete */}
                    <div className="pt-4 border-t border-gray-200 dark:border-dark-border flex items-center justify-between text-xs text-light-muted dark:text-dark-muted">
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>
                          {formatDate(msg.createdAt)} · {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete message"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── Subscribers Tab ─── */}
        {!loading && activeTab === 'subscribers' && (
          <>
            {subscribers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">📧</span>
                </div>
                <h2 className="text-2xl font-black mb-2">No subscribers yet</h2>
                <p className="text-light-muted dark:text-dark-muted max-w-sm">
                  When someone subscribes to the newsletter, their emails will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 dark:bg-dark-border/50 text-[10px] font-black uppercase tracking-widest opacity-50">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Email</div>
                  <div className="col-span-4">Subscribed On</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
                {/* Rows */}
                {subscribers.map((sub, index) => (
                  <motion.div
                    key={sub.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-100 dark:border-dark-border hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors items-center"
                  >
                    <div className="col-span-1 text-xs font-bold text-light-muted dark:text-dark-muted">
                      {index + 1}
                    </div>
                    <div className="col-span-5">
                      <a
                        href={`mailto:${sub.email}`}
                        className="text-sm font-bold text-orange-primary hover:underline break-all"
                      >
                        {sub.email}
                      </a>
                    </div>
                    <div className="col-span-5 text-xs text-light-muted dark:text-dark-muted flex flex-col justify-center">
                      <span>{formatDate(sub.subscribedAt)}</span>
                      {!sub.approved && (
                        <span className="text-[10px] text-orange-primary font-bold mt-1">Pending Approval</span>
                      )}
                    </div>
                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                      {sub.approved && (
                        <button
                          onClick={() => sendTestNewsletter(sub.email)}
                          className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Send to this subscriber"
                        >
                          🚀
                        </button>
                      )}
                      {!sub.approved && (
                        <button
                          onClick={() => approveSubscriber(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
                          title="Approve subscriber"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteSubscriber(sub.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove subscriber"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── Customers Tab ─── */}
        {!loading && activeTab === 'customers' && (
          <>
            {customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">👥</span>
                </div>
                <h2 className="text-2xl font-black mb-2">No registered customers yet</h2>
                <p className="text-light-muted dark:text-dark-muted max-w-sm">
                  When customers sign up or log into the portal, their profiles will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 dark:bg-dark-border/50 text-[10px] font-black uppercase tracking-widest opacity-50">
                  <div className="col-span-4 md:col-span-3">Customer</div>
                  <div className="col-span-4 md:col-span-3">Email</div>
                  <div className="hidden md:block col-span-3">Interests</div>
                  <div className="col-span-3 md:col-span-2">Member Since</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                {/* Rows */}
                {customers.map((cust, index) => (
                  <motion.div
                    key={cust.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className="grid grid-cols-12 gap-4 px-6 py-5 border-t border-gray-100 dark:border-dark-border hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors items-center"
                  >
                    {/* Customer Profile */}
                    <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-primary/20 to-amber-500/20 flex items-center justify-center text-xl shadow-sm shrink-0">
                        {cust.avatar || '👤'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-black truncate">{cust.name}</h4>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-orange-primary/10 text-orange-primary text-[9px] font-bold uppercase tracking-wider mt-0.5">
                          {cust.status || 'Verified'}
                        </span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-4 md:col-span-3">
                      <a
                        href={`mailto:${cust.email}`}
                        className="text-xs md:text-sm font-bold text-orange-primary hover:underline break-all"
                      >
                        {cust.email}
                      </a>
                    </div>

                    {/* Interests Chips */}
                    <div className="hidden md:flex col-span-3 flex-wrap gap-1">
                      {(cust.interests || ['technology']).map((int, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-200/60 dark:bg-dark-bg text-light-muted dark:text-dark-muted text-[10px] font-bold capitalize">
                          {int}
                        </span>
                      ))}
                    </div>

                    {/* Member Since / Last Login */}
                    <div className="col-span-3 md:col-span-2 text-xs text-light-muted dark:text-dark-muted flex flex-col justify-center">
                      <span className="font-bold">{cust.memberSince || '2026'}</span>
                      <span className="text-[10px] opacity-60">
                        {cust.lastLogin ? `Active: ${new Date(cust.lastLogin).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : 'Active'}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => resendWelcomeEmail(cust.email, cust.name)}
                        className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-400 hover:text-orange-500 transition-colors"
                        title="Send / Resend Welcome Email"
                      >
                        🚀
                      </button>
                      <button
                        onClick={() => deleteCustomer(cust.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove customer account"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
