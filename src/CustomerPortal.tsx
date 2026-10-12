import { useState } from 'react';
import { Ticket, TicketCategory, TicketPriority } from './types';
import { createTicket } from './store';
import { sendNewTicketEmail, isEmailConfigured } from './emailService';
import { CheckCircle, AlertCircle, Loader2, Shield, Server, Network, Monitor, Lock, Bell, Ticket as TicketIcon } from 'lucide-react';

interface CustomerPortalProps {
  onBack: () => void;
}

export default function CustomerPortal({ onBack }: CustomerPortalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'it-infrastructure' as TicketCategory,
    priority: 'medium' as TicketPriority,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    siteLocation: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create ticket in localStorage
      const newTicket = createTicket({
        ...form,
        status: 'open',
        createdBy: form.customerName,
        assignedTo: '',
      });

      // Send email notification
      const emailSuccess = await sendNewTicketEmail(newTicket);
      setEmailSent(emailSuccess);

      setTicketNumber(newTicket.ticketNumber);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Ticket Submitted Successfully!</h1>
            <p className="text-gray-600">Your support request has been received</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-900">Ticket Number</span>
              <span className="text-2xl font-bold text-blue-600">{ticketNumber}</span>
            </div>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Title:</strong> {form.title}</p>
              <p><strong>Category:</strong> {formatCategory(form.category)}</p>
              <p><strong>Priority:</strong> {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}</p>
              <p><strong>Location:</strong> {form.siteLocation}</p>
            </div>
          </div>

          {emailSent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Email notification sent</p>
                  <p className="text-sm text-green-700 mt-1">Our support team has been notified and will contact you shortly.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Ticket created successfully</p>
                  <p className="text-sm text-amber-700 mt-1">Your ticket has been logged. Our team will review and respond soon.</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Our support team will review your ticket and assign it to the appropriate technician</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>You will receive a follow-up call or email within 2 business hours for urgent issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>For non-urgent issues, we aim to respond within 24 business hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>You can reference your ticket number <strong>{ticketNumber}</strong> in any future communications</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  title: '',
                  description: '',
                  category: 'it-infrastructure',
                  priority: 'medium',
                  customerName: '',
                  customerEmail: '',
                  customerPhone: '',
                  siteLocation: '',
                });
              }}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Submit Another Ticket
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Return to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              JEB
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">JEB Innovations & Technologies</h1>
          <p className="text-lg text-gray-600">IT & Physical Security Support Portal</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            ← Back to Admin Dashboard
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit a Support Request</h2>
            <p className="text-gray-600">Fill in the details below and our team will assist you</p>
          </div>

          {!isEmailConfigured() && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Email notifications not configured</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Please configure EmailJS in <code className="bg-amber-100 px-1 rounded">src/emailConfig.ts</code> to enable email notifications.
                    Tickets will still be created and stored locally.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name / Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name or company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.sg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+65 XXXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.siteLocation}
                    onChange={(e) => setForm({ ...form, siteLocation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full address of the site"
                  />
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TicketIcon className="w-5 h-5 text-blue-600" />
                </div>
                Issue Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide as much detail as possible about the issue..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <optgroup label="IT Services">
                      <option value="it-infrastructure">IT Infrastructure</option>
                      <option value="it-network">Network Issues</option>
                      <option value="it-software">Software</option>
                      <option value="it-hardware">Hardware</option>
                    </optgroup>
                    <optgroup label="Physical Security">
                      <option value="physical-security-cctv">CCTV Systems</option>
                      <option value="physical-security-access">Access Control</option>
                      <option value="physical-security-alarm">Alarm Systems</option>
                      <option value="physical-security-other">Other Security</option>
                    </optgroup>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="critical">Critical - System Down / Security Breach</option>
                    <option value="high">High - Major Functionality Affected</option>
                    <option value="medium">Medium - Partial Impact</option>
                    <option value="low">Low - Minor Issue / Inquiry</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Support Request
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 JEB Innovations & Technologies Pte Ltd</p>
          <p className="mt-1">IT & Physical Security Solutions</p>
        </div>
      </div>
    </div>
  );
}

function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'it-infrastructure': 'IT Infrastructure',
    'it-network': 'IT Network',
    'it-software': 'IT Software',
    'it-hardware': 'IT Hardware',
    'physical-security-cctv': 'Physical Security - CCTV',
    'physical-security-access': 'Physical Security - Access Control',
    'physical-security-alarm': 'Physical Security - Alarm Systems',
    'physical-security-other': 'Physical Security - Other',
    'general': 'General Inquiry',
  };
  return categoryMap[category] || category;
}
