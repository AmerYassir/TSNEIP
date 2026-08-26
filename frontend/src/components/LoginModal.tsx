import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { useAuth } from '../context/AuthContext';
import { X, User, Lock, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export const LoginModal: React.FC<LoginModalProps> = ({ lang, isOpen, onClose }) => {
  const t = translations[lang];
  const { login, register, isLoading, error, clearError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState(import.meta.env.VITE_DEV_EMAIL || '');
  const [username, setUsername] = useState(import.meta.env.VITE_DEV_USERNAME || '');
  const [password, setPassword] = useState(import.meta.env.VITE_DEV_PASSWORD || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRTL = lang === 'ar';

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setLocalError(null);
    setSuccessMsg(null);
    clearError();
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const validate = (): boolean => {
    if (mode === 'login') {
      if (!username.trim()) {
        setLocalError(isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required');
        return false;
      }
    } else {
      if (!username.trim()) {
        setLocalError(isRTL ? 'اسم المستخدم مطلوب' : 'Username is required');
        return false;
      }
      if (!email.trim()) {
        setLocalError(isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required');
        return false;
      }
    }
    if (password.length < 6) {
      setLocalError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);
    clearError();

    if (!validate()) return;

    try {
      if (mode === 'login') {
        // The 'username' field in login mode is actually the email address
        await login({ email: username, password });
        setSuccessMsg(isRTL ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 800);
      } else {
        await register({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        });
        setSuccessMsg(isRTL ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 800);
      }
    } catch {
      // Error is handled by auth context and displayed below
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#D1DCE5] w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#006BB2] text-white p-4 flex items-center justify-between border-b border-[#005794]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#009600] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-extrabold text-base font-heading">
              {mode === 'login'
                ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                : (isRTL ? 'إنشاء حساب جديد' : 'Create Account')}
            </h3>
          </div>
          <button
            onClick={() => { onClose(); resetForm(); }}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#006BB2] text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#006BB2] text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isRTL ? 'حساب جديد' : 'Register'}
          </button>
        </div>

        {/* Error / Success Alerts */}
        {displayError && (
          <div className="bg-rose-50 border-b border-rose-200 p-3 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{displayError}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Username / Email (login) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {mode === 'login'
                ? (isRTL ? 'البريد الإلكتروني' : 'Email')
                : (isRTL ? 'اسم المستخدم' : 'Username')} *
            </label>
            <div className="relative">
              <User className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} pointer-events-none`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'login'
                  ? (isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email')
                  : (isRTL ? 'أدخل اسم المستخدم' : 'Enter username')}
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isRTL ? 'البريد الإلكتروني' : 'Email'} *
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} pointer-events-none`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                  className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none`}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* First / Last Name (register only) */}
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'الاسم الأول' : 'First Name'}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'الاسم الأخير' : 'Last Name'}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isRTL ? 'كلمة المرور' : 'Password'} *
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} pointer-events-none`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#009600] hover:bg-[#008000] text-white rounded-md text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400/30 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <Lock className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span>
              {mode === 'login'
                ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                : (isRTL ? 'إنشاء الحساب' : 'Create Account')}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};