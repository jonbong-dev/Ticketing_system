import { useState, useEffect } from 'react';
import { getEmailConfig, saveEmailConfig, EmailConfig, testEmailConfig } from './emailConfig';
import { ArrowLeft, Save, TestTube, CheckCircle, AlertCircle, Mail, Server, Lock, User, Globe } from 'lucide-react';

interface AdminSettingsProps {
  onBack: () => void;
}

export default function AdminSettings({ onBack }: AdminSettingsProps) {
  const [config, setConfig] = useState<EmailConfig>(getEmailConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveEmailConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    const result = await testEmailConfig(config);
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Settings</h1>
                <p className="text-xs text-gray-500">Configure email services and system settings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Email Service Configuration</h2>
              <p className="text-sm text-gray-600">Configure how emails are sent from the system</p>
            </div>
          </div>

          {/* Service Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email Service Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setConfig({ ...config, serviceType: 'emailjs' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.serviceType === 'emailjs'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">EmailJS</span>
                  {config.serviceType === 'emailjs' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  Client-side email service. Works on Cloudflare Pages free tier. No backend required.
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">✓ Recommended for Cloudflare deployment</p>
              </button>

              <button
                onClick={() => setConfig({ ...config, serviceType: 'smtp' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.serviceType === 'smtp'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-800">SMTP Server</span>
                  {config.serviceType === 'smtp' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  Direct SMTP connection. Requires backend server or Cloudflare Worker.
                </p>
                <p className="text-xs text-amber-600 mt-2 font-medium">⚠ Requires backend setup</p>
              </button>
            </div>
          </div>

          {/* EmailJS Configuration */}
          {config.serviceType === 'emailjs' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">EmailJS Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.emailjs.serviceId}
                  onChange={(e) => setConfig({
                    ...config,
                    emailjs: { ...config.emailjs, serviceId: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="service_xxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from EmailJS Dashboard → Email Services
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.emailjs.templateId}
                  onChange={(e) => setConfig({
                    ...config,
                    emailjs: { ...config.emailjs, templateId: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="template_xxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from EmailJS Dashboard → Email Templates
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Public Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.emailjs.publicKey}
                  onChange={(e) => setConfig({
                    ...config,
                    emailjs: { ...config.emailjs, publicKey: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="xxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from EmailJS Dashboard → Account → API Keys
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800 font-medium mb-2">📚 Need Help?</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Sign up at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a> (free: 200 emails/month)</li>
                  <li>• Add email service (Gmail, Outlook, etc.)</li>
                  <li>• Create email templates for ticket notifications and password resets</li>
                  <li>• Copy credentials above</li>
                </ul>
              </div>
            </div>
          )}

          {/* SMTP Configuration */}
          {config.serviceType === 'smtp' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">SMTP Server Settings</h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800 font-medium mb-2">⚠️ Backend Required</p>
                <p className="text-xs text-amber-700">
                  SMTP configuration requires a backend server or Cloudflare Worker to handle email sending.
                  The credentials below will be used by your backend API.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.smtp.host}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, host: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={config.smtp.port}
                    onChange={(e) => setConfig({
                      ...config,
                      smtp: { ...config.smtp, port: parseInt(e.target.value) || 587 }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Encryption
                  </label>
                  <select
                    value={config.smtp.secure}
                    onChange={(e) => setConfig({
                      ...config,
                      smtp: { ...config.smtp, secure: e.target.value as 'tls' | 'ssl' | 'none' }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="tls">TLS (Port 587)</option>
                    <option value="ssl">SSL (Port 465)</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.smtp.username}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, username: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={config.smtp.password}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, password: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For Gmail, use App Password (not your regular password)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={config.smtp.fromEmail}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, fromEmail: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="noreply@jebinnovations.sg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backend API Endpoint
                </label>
                <input
                  type="url"
                  value={config.smtp.apiEndpoint}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, apiEndpoint: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-worker.workers.dev/api/send-email"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your backend API endpoint that handles SMTP email sending
                </p>
              </div>
            </div>
          )}

          {/* Common Settings */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">General Email Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email (Recipient) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={config.recipientEmail}
                  onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="support@jebinnovations.sg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email address where ticket notifications will be sent
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={config.companyName}
                    onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="JEB Innovations & Technologies Pte Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    value={config.supportPhone}
                    onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+65 6123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saved ? '✓ Saved!' : 'Save Configuration'}
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube size={18} />
                  Test Configuration
                </>
              )}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              testResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.success ? '✓ Test Email Sent Successfully!' : '✗ Test Failed'}
                  </p>
                  <p className={`text-sm mt-1 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {testResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📚 Setup Guide</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>For EmailJS (Recommended):</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Sign up at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a></li>
              <li>Add email service (Gmail, Outlook, etc.)</li>
              <li>Create email templates</li>
              <li>Copy Service ID, Template ID, and Public Key</li>
              <li>Paste credentials above and save</li>
              <li>Click "Test Configuration" to verify</li>
            </ol>
            <p className="mt-3"><strong>For SMTP:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Set up a backend server or Cloudflare Worker</li>
              <li>Configure SMTP credentials above</li>
              <li>Provide your backend API endpoint</li>
              <li>Test the configuration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
