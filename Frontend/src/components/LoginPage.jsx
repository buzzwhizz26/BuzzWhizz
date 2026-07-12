import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useNewsContext } from '../context/NewsContext';

const availableCategories = [
  { name: 'Tech & AI 🤖', slug: 'technology' },
  { name: 'Business 📈', slug: 'business' },
  { name: 'Startups 🚀', slug: 'startups' },
  { name: 'Entertainment 🎬', slug: 'entertainment' },
  { name: 'Sports 🏆', slug: 'sports' },
  { name: 'Meme Culture 🔥', slug: 'memes' },
  { name: 'Crypto & Web3 💎', slug: 'crypto' },
];

export default function LoginPage() {
  const { customer, loginCustomer, logoutCustomer, t } = useNewsContext();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true,
    selectedInterests: ['technology', 'startups', 'memes'],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMsg('');
  };

  const toggleInterest = (slug) => {
    setFormData((prev) => {
      const exists = prev.selectedInterests.includes(slug);
      if (exists) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter((i) => i !== slug) };
      } else {
        return { ...prev, selectedInterests: [...prev.selectedInterests, slug] };
      }
    });
  };

  const saveCustomerToBackend = (userData) => {
    fetch('http://localhost:5000/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).catch((err) => console.error('Failed to sync customer to backend:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signin') {
        if (!formData.email || !formData.password) {
          setErrorMsg('Please enter both email and password.');
          return;
        }
        // Simulate Login
        const nameFromEmail = formData.email.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        const userData = {
          name: formattedName || 'Valued Customer',
          email: formData.email,
          avatar: '⚡',
          interests: formData.selectedInterests,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        };
        loginCustomer(userData);
        saveCustomerToBackend(userData);
        setSuccessMsg(`Welcome back, ${userData.name}! ⚡`);
      } else if (mode === 'signup') {
        if (!formData.name || !formData.email || !formData.password) {
          setErrorMsg('Please fill out all required fields.');
          return;
        }
        if (formData.password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          return;
        }

        // Check against existing accounts
        const knownEmails = [
          '2021bcalakshya9609@poornima.edu.in',
          'alex.rivera@buzzwhizz.com',
          'yatharth.mulani@gmail.com',
          'priya.sharma@techcorp.in'
        ];
        const localCust = localStorage.getItem('buzzwhizz_customer');
        let existingEmails = [...knownEmails];
        if (localCust) {
          try {
            const parsed = JSON.parse(localCust);
            if (parsed && parsed.email) existingEmails.push(parsed.email);
          } catch(e){}
        }

        if (existingEmails.some(em => em.toLowerCase() === formData.email.toLowerCase())) {
          setErrorMsg('⚠️ An account with this email already exists! Please sign in instead.');
          return;
        }

        const userData = {
          name: formData.name,
          email: formData.email,
          avatar: '🔥',
          interests: formData.selectedInterests,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          isSignUp: true,
        };

        fetch('http://localhost:5000/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })
          .then(async (res) => {
            const data = await res.json();
            if (res.status === 409 || data.status === 'error') {
              setErrorMsg('⚠️ An account with this email already exists! Please sign in instead.');
            } else {
              loginCustomer(userData);
              setSuccessMsg(`Account created successfully! 📧 Welcome email delivered to ${userData.email}! 🔥`);
            }
          })
          .catch(() => {
            loginCustomer(userData);
            setSuccessMsg(`Account created successfully! 📧 Welcome email delivered to ${userData.email}! 🔥`);
          });
      } else if (mode === 'forgot') {
        if (!formData.email) {
          setErrorMsg('Please enter your email address.');
          return;
        }
        setSuccessMsg(`Password reset link sent to ${formData.email}! Check your inbox.`);
      }
    }, 1000);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      const demoUser = {
        name: 'Alex Rivera (Pro Customer)',
        email: 'alex.rivera@buzzwhizz.com',
        avatar: '👑',
        interests: ['technology', 'startups', 'memes', 'business'],
        memberSince: 'Jan 2026',
        isDemo: true,
      };
      loginCustomer(demoUser);
      saveCustomerToBackend(demoUser);
      setIsLoading(false);
      setSuccessMsg('Logged in as Demo Customer! Welcome to BuzzWhizz Pro ⚡');
    }, 600);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      const socialUser = {
        name: `${provider} Customer`,
        email: `customer.${provider.toLowerCase()}@buzzwhizz.com`,
        avatar: provider === 'Google' ? '🟢' : provider === 'Apple' ? '🍎' : '🐦',
        interests: ['technology', 'entertainment', 'memes'],
        memberSince: 'Today',
      };
      loginCustomer(socialUser);
      saveCustomerToBackend(socialUser);
      setIsLoading(false);
      setSuccessMsg(`Connected with ${provider}! Welcome aboard ⚡`);
    }, 800);
  };

  // If already logged in, display the Customer Dashboard / Welcome Screen
  if (customer) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Glowing Accents */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center relative z-10"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-orange-primary to-amber-500 flex items-center justify-center text-4xl shadow-xl shadow-orange-primary/30 mb-6 animate-bounce">
            {customer.avatar || '👤'}
          </div>
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-xs font-black uppercase tracking-widest mb-3">
            {customer.isDemo ? '⚡ VIP DEMO ACCESS' : '✨ VERIFIED CUSTOMER'}
          </span>

          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Welcome back, <span className="text-gradient">{customer.name}</span>!
          </h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mb-8 font-medium">
            {customer.email} • Member since {customer.memberSince || '2026'}
          </p>

          <div className="bg-gray-50 dark:bg-dark-bg/60 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-dark-border text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-3">
              🎯 Your Personalized Feed Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {(customer.interests && customer.interests.length > 0 ? customer.interests : ['technology', 'memes']).map((slug) => {
                const catObj = availableCategories.find((c) => c.slug === slug);
                return (
                  <span key={slug} className="px-3 py-1 rounded-lg bg-orange-primary/10 text-orange-primary font-bold text-xs">
                    {catObj ? catObj.name : slug.toUpperCase()}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-4 px-6 rounded-2xl bg-orange-primary text-white font-black text-sm tracking-wide shadow-xl shadow-orange-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              GO TO NEWS FEED ⚡
            </button>
            <button
              onClick={() => {
                logoutCustomer();
                setMode('signin');
              }}
              className="py-4 px-6 rounded-2xl bg-gray-100 dark:bg-dark-bg text-light-muted dark:text-dark-muted hover:text-red-500 dark:hover:text-red-400 font-bold text-sm transition-colors border border-gray-200 dark:border-dark-border"
            >
              SIGN OUT
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glowing Accents */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-primary/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border border-gray-100 dark:border-dark-border rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative z-10"
      >
        {/* Header Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-3">
            <img src="/logo.png" alt="BuzzWhizz" className="h-11 w-auto rounded-xl shadow-md group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-black text-orange-primary tracking-tight">BuzzWhizz</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black mb-2">
            {mode === 'signin' && 'Welcome Back to the Buzz.'}
            {mode === 'signup' && 'Join the Meme News Revolution.'}
            {mode === 'forgot' && 'Reset Your Password.'}
          </h1>
          <p className="text-xs md:text-sm text-light-muted dark:text-dark-muted font-medium">
            {mode === 'signin' && 'Sign in to access your customized feed, saved stories & instant alerts.'}
            {mode === 'signup' && 'Create your free customer portal to personalize your news experience.'}
            {mode === 'forgot' && "Enter your email and we'll send you a recovery link in seconds."}
          </p>
        </div>

        {/* Mode Switcher Tabs (Only show for Signin/Signup) */}
        {mode !== 'forgot' && (
          <div className="flex rounded-2xl bg-gray-100 dark:bg-dark-bg p-1.5 mb-8 border border-gray-200/60 dark:border-dark-border">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative ${
                mode === 'signin'
                  ? 'text-white shadow-md'
                  : 'text-light-muted dark:text-dark-muted hover:text-orange-primary'
              }`}
            >
              {mode === 'signin' && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-orange-primary rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative ${
                mode === 'signup'
                  ? 'text-white shadow-md'
                  : 'text-light-muted dark:text-dark-muted hover:text-orange-primary'
              }`}
            >
              {mode === 'signup' && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-orange-primary rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              Create Account
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </motion.div>
        )}
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-bold flex items-center gap-2">
            <span>✅</span> {successMsg}
          </motion.div>
        )}

        {/* Social Login Buttons */}
        {mode !== 'forgot' && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-3 px-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:border-orange-primary/40 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>🟢</span> Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="py-3 px-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:border-orange-primary/40 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>🍎</span> Apple
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Twitter')}
                className="py-3 px-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:border-orange-primary/40 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>🐦</span> Twitter
              </button>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
            </div>
          </>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="text-xs font-bold opacity-70 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Yatharth Mulani"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none text-sm font-medium transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-xs font-bold opacity-70 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="customer@buzzwhizz.com"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none text-sm font-medium transition-colors"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold opacity-70 ml-1">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-xs font-bold text-orange-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none text-sm font-medium transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="interests-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-2 space-y-2 overflow-hidden"
              >
                <label className="text-xs font-black uppercase tracking-wider text-orange-primary ml-1 block">
                  ✨ Pick Your Favorite News Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => {
                    const isSelected = formData.selectedInterests.includes(cat.slug);
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => toggleInterest(cat.slug)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-orange-primary text-white shadow-md shadow-orange-primary/20 scale-105'
                            : 'bg-gray-100 dark:bg-dark-bg text-light-muted dark:text-dark-muted hover:bg-gray-200 dark:hover:bg-dark-border'
                        }`}
                      >
                        {cat.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'signin' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded text-orange-primary focus:ring-orange-primary accent-orange-primary"
              />
              <label htmlFor="rememberMe" className="text-xs font-semibold text-light-muted dark:text-dark-muted cursor-pointer">
                Remember my device for 30 days
              </label>
            </div>
          )}

          {mode === 'signup' && (
            <p className="text-[11px] text-light-muted dark:text-dark-muted leading-normal pt-1">
              By creating an account, you agree to BuzzWhizz's <Link to="/about" className="text-orange-primary underline font-bold">Terms of Service</Link> and <Link to="/about" className="text-orange-primary underline font-bold">Privacy Policy</Link>.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-orange-primary text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-primary/25 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-lg">⏳</span> Processing...
              </>
            ) : mode === 'signin' ? (
              'Sign In ⚡'
            ) : mode === 'signup' ? (
              'Create Customer Portal ⚡'
            ) : (
              'Send Reset Link 📧'
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        {mode === 'signin' && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border text-center">
            <p className="text-xs font-bold text-light-muted dark:text-dark-muted mb-3">Want to test without typing?</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-primary font-black text-xs uppercase tracking-wider hover:bg-orange-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              👑 1-Click VIP Demo Customer Login
            </button>
          </div>
        )}

        {/* Back to sign in from forgot */}
        {mode === 'forgot' && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-xs font-black text-orange-primary hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
