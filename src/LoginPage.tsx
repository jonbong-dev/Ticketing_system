import { useState } from 'react';
import { login, registerCustomer, findUserByEmail, generateTemporaryPassword, resetPassword } from './authService';
import { sendPasswordResetEmail } from './emailService';
import { User } from './authTypes';
import { Mail, Lock, User as UserIcon, Building2, Phone, LogIn, UserPlus, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'select' | 'customer-login' | 'admin-login' | 'customer-register' | 'forgot-password'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('Attempting login with:', { email, password });
    
    const user = login(email, password);
    
    console.log('Login result:', user);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Please check your credentials or use "Reset System" to start fresh.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = registerCustomer({
      email,
      password,
      name,
      phone,
      company,
    });
    
    if (user) {
      // Auto-login after registration
      const loggedInUser = login(email, password);
      if (loggedInUser) {
        onLogin(loggedInUser);
      }
    } else {
      setError('Email already registered');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess(false);
    
    const user = findUserByEmail(email);
    if (!user) {
      setError('Email not found');
      return;
    }
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Send email with temporary password
    const emailSent = await sendPasswordResetEmail(email, user.name, tempPassword);
    
    if (emailSent) {
      // Update user's password to temporary password
      await resetPassword(email, tempPassword);
      setResetSuccess(true);
      setResetEmail(email);
    } else {
      setError('Failed to send reset email. Please contact support.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setCompany('');
    setError('');
    setResetSuccess(false);
    setResetEmail('');
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  JEB
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">JEB Innovations & Technologies</h1>
            <p className="text-xl text-blue-100">IT & Physical Security Support Portal</p>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Customer Portal */}
            <button
              onClick={() => { setMode('customer-login'); resetForm(); }}
              className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-left group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Portal</h2>
              <p className="text-gray-600 mb-4">
                Submit support tickets, track your requests, and communicate with our team
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Login as Customer</span>
                <LogIn className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Admin Portal */}
            <button
              onClick={() => { setMode('admin-login'); resetForm(); }}
              className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-left group"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h2>
              <p className="text-gray-600 mb-4">
                Manage tickets, assign technicians, and provide support to customers
              </p>
              <div className="flex items-center text-indigo-600 font-semibold">
                <span>Login as Admin</span>
                <LogIn className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-blue-100 text-sm">
            <p>© 2024 JEB Innovations & Technologies Pte Ltd</p>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register Forms
  const isCustomerLogin = mode === 'customer-login';
  const isAdminLogin = mode === 'admin-login';
  const isRegister = mode === 'customer-register';
  const isForgotPassword = mode === 'forgot-password';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => { setMode('select'); resetForm(); }}
          className="text-white hover:text-blue-100 mb-6 flex items-center gap-2 transition-colors"
        >
          ← Back to login options
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">JEB</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isCustomerLogin && 'Customer Login'}
              {isAdminLogin && 'Admin Login'}
              {isRegister && 'Create Customer Account'}
              {isForgotPassword && 'Reset Password'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isCustomerLogin && 'Access your support tickets'}
              {isAdminLogin && 'Manage support tickets'}
              {isRegister && 'Register to submit support requests'}
              {isForgotPassword && 'We\'ll send you a temporary password'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={isForgotPassword ? handleForgotPassword : (isRegister ? handleRegister : handleLogin)} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ABC Corporation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+65 9123 4567"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@company.sg"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                isForgotPassword
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : isAdminLogin
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRegister ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              ) : isForgotPassword ? (
                <>
                  <KeyRound className="w-5 h-5" />
                  Send Reset Link
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {isCustomerLogin && (
            <>
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setMode('forgot-password'); resetForm(); }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setMode('customer-register'); resetForm(); }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Don't have an account? Register here
                </button>
              </div>
            </>
          )}

          {isAdminLogin && (
            <div className="mt-6 text-center">
              <button
                onClick={() => { setMode('forgot-password'); resetForm(); }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {isRegister && (
            <div className="mt-6 text-center">
              <button
                onClick={() => { setMode('customer-login'); resetForm(); }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Already have an account? Login here
              </button>
            </div>
          )}

          {isForgotPassword && (
            <>
              {resetSuccess ? (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Password reset email sent to {resetEmail}
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    Check your inbox for a temporary password. You can use it to login and then change it.
                  </p>
                </div>
              ) : null}
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setMode('select'); resetForm(); setResetSuccess(false); }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Back to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
