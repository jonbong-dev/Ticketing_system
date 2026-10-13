import { useState } from 'react';
import { registerCustomer, resetPassword } from './authService';
import { encodePassword } from './passwordUtils';
import { User } from './authTypes';
import { User as UserIcon, Mail, Lock, Shield, CheckCircle } from 'lucide-react';

interface SetupPageProps {
  onComplete: () => void;
}

export default function SetupPage({ onComplete }: SetupPageProps) {
  const [step, setStep] = useState<'welcome' | 'admin' | 'complete'>('welcome');
  const [adminEmail, setAdminEmail] = useState('admin@jebinnovations.sg');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('JEB Admin');
  const [error, setError] = useState('');

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (adminPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Encode the password
      const hashedPassword = encodePassword(adminPassword);

      // Create admin user directly in localStorage
      const adminUser: User = {
        id: 'admin-1',
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin',
      };

      // Save to localStorage
      const usersKey = 'jeb_users';
      const existingUsers = localStorage.getItem(usersKey);
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if admin already exists
      const existingAdminIndex = users.findIndex((u: User) => u.role === 'admin');
      if (existingAdminIndex >= 0) {
        users[existingAdminIndex] = adminUser;
      } else {
        users.push(adminUser);
      }
      
      localStorage.setItem(usersKey, JSON.stringify(users));

      setStep('complete');
    } catch (err) {
      setError('Failed to create admin account. Please try again.');
      console.error(err);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">JEB</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to JEB Ticketing System</h1>
            <p className="text-gray-600 text-lg">
              Let's set up your admin account to get started
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              First-Time Setup
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Create your admin account</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Configure email notifications (optional)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Start managing support tickets</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setStep('admin')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3"
          >
            Create Admin Account
          </button>

          <button
            onClick={() => {
              if (confirm('This will clear all data and start fresh. Are you sure?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Reset System (Clear All Data)
          </button>
        </div>
      </div>
    );
  }

  if (step === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Admin Account</h2>
            <p className="text-gray-600 mt-2">Set up your administrator credentials</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JEB Admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@jebinnovations.sg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a strong password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Choose a strong password with at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Create Admin Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Complete!</h2>
          <p className="text-gray-600 mb-6">
            Your admin account has been created successfully. You can now login and start managing support tickets.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800 font-medium mb-2">Your Admin Credentials:</p>
            <p className="text-sm text-blue-700">
              <strong>Email:</strong> {adminEmail}<br />
              <strong>Password:</strong> (the password you just set)
            </p>
          </div>
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
