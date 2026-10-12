import { useState } from 'react';
import { login, registerCustomer } from './authService';
import { User } from './authTypes';
import { Mail, Lock, User as UserIcon, Building2, Phone, LogIn, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'select' | 'customer-login' | 'admin-login' | 'customer-register'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = login(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setCompany('');
    setError('');
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
            </h2>
            <p className="text-gray-600 mt-2">
              {isCustomerLogin && 'Access your support tickets'}
              {isAdminLogin && 'Manage support tickets'}
              {isRegister && 'Register to submit support requests'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
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

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                isAdminLogin
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRegister ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
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
            <div className="mt-6 text-center">
              <button
                onClick={() => { setMode('customer-register'); resetForm(); }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Don't have an account? Register here
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

          {/* Demo Credentials */}
          {(isCustomerLogin || isAdminLogin) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
              {isCustomerLogin ? (
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Email:</strong> customer@example.com</p>
                  <p><strong>Password:</strong> customer123</p>
                </div>
              ) : (
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Email:</strong> admin@jebinnovations.sg</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
