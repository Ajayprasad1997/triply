import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Envelope, 
  Lock, 
  Eye, 
  EyeSlash, 
  Warning, 
  Key, 
  ArrowLeft 
} from '@phosphor-icons/react';
import { TriiplyLogo } from '../components/TriiplyLogo';
import { addAuditLog } from '../data/mockData';
import { api } from '../services/api';
import { 
  createSecureSession, 
  trackFailedLogin, 
  registerFailedLoginAttempt, 
  resetFailedLoginAttempts, 
  sanitizeInput 
} from '../utils/security';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Preserve only valid Super Admin destinations.
  const requestedPath = location.state?.from?.pathname;
  const from = requestedPath?.startsWith('/admin') ? requestedPath : '/admin';

  // Check lockout on email input change & periodically
  useEffect(() => {
    if (!email) return;
    const checkLock = () => {
      const lockStatus = trackFailedLogin(email);
      if (lockStatus.locked) {
        setLockoutSecs(lockStatus.remainingSeconds);
      } else {
        setLockoutSecs(0);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Input sanitization
    const cleanEmail = sanitizeInput(email).trim().toLowerCase();
    const cleanPassword = password; // Passwords shouldn't be HTML-encoded to preserve symbols, but handled safely

    if (!cleanEmail || !cleanPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Check Lockout again before verifying
    const lockStatus = trackFailedLogin(cleanEmail);
    if (lockStatus.locked) {
      setError(`Account temporarily locked. Please wait ${lockStatus.remainingSeconds}s.`);
      return;
    }

    setLoading(true);

    try {
      const response = await api.login({ email: cleanEmail, password: cleanPassword });
      if (response.success && response.user) {
        if (response.user.role !== 'admin') {
          throw new Error('Only the Triiply Super Administrator can access this portal.');
        }
        resetFailedLoginAttempts(cleanEmail);
        createSecureSession(response.user.associatedId || response.user.userId, response.user.role, cleanEmail);
        addAuditLog('USER_LOGIN', cleanEmail, `Successful login from backend API. Redirecting to ${response.user.role} workspace.`, 'Info');
        setLoading(false);
        navigate(from);
        return;
      }
    } catch (apiErr: any) {
      // Track failed attempt
      const lockState = registerFailedLoginAttempt(cleanEmail);
      addAuditLog('LOGIN_FAILED', cleanEmail, `Unsuccessful login attempt for: ${cleanEmail}`, 'Warning');
      setLoading(false);
      if (lockState.locked) {
        setLockoutSecs(lockState.remainingSeconds);
        setError(`Too many failed attempts. Login locked for ${lockState.remainingSeconds} seconds.`);
      } else {
        setError(apiErr.message || 'Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Dynamic Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-xl z-10">
        
        {/* Brand Logo & Back Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 group" aria-label="Back to Home">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="flex justify-center mb-4">
            <TriiplyLogo className="h-10" showTagline={false} />
          </div>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900">
            Admin Portal Login
          </h2>
          <p className="mt-2 text-xs text-slate-500 font-semibold leading-relaxed">
            Enter your Super Admin credentials to access the Triiply platform management control center.
          </p>
        </div>

        {/* Form panel */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
              <Warning size={20} weight="fill" className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                Admin Email Address
              </label>
              <div className="relative">
                <Envelope size={18} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@triiply.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                  Admin Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                  disabled={loading || lockoutSecs > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || lockoutSecs > 0}
              className={`w-full py-3.5 rounded-xl text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                lockoutSecs > 0
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                  : 'bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-sky-500/20'
              }`}
            >
              {loading ? (
                <span>Validating Session...</span>
              ) : lockoutSecs > 0 ? (
                <span>Locked ({lockoutSecs}s)</span>
              ) : (
                <>
                  <Key size={18} weight="bold" />
                  <span>Authenticate Admin Session</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
