import { useState, useEffect } from 'react';
import { Ticket, TicketCategory, TicketPriority } from './types';
import { getTickets, createTicket, addNote } from './store';
import { sendNewTicketEmail } from './emailService';
import { User } from './authTypes';
import { logout } from './authService';
import { 
  LogOut, PlusCircle, Ticket as TicketIcon, Clock, CheckCircle, 
  AlertCircle, MessageSquare, Building2, Phone, Mail, Loader2,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function CustomerDashboard({ user, onLogout }: CustomerDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'it-infrastructure' as TicketCategory,
    priority: 'medium' as TicketPriority,
    siteLocation: '',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const allTickets = getTickets();
    // Filter tickets for this customer (by email or name)
    const customerTickets = allTickets.filter(t => 
      t.customerEmail === user.email || t.customerName === user.name
    );
    setTickets(customerTickets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newTicket = createTicket({
        ...form,
        status: 'open',
        createdBy: user.name,
        assignedTo: '',
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
      });

      await sendNewTicketEmail(newTicket);
      
      // Reset form and reload tickets
      setForm({
        title: '',
        description: '',
        category: 'it-infrastructure',
        priority: 'medium',
        siteLocation: '',
      });
      setShowNewTicketForm(false);
      loadTickets();
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-amber-100 text-amber-700';
      case 'pending': return 'bg-purple-100 text-purple-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const openTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JEB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Customer Portal</h1>
                <p className="text-xs text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{tickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TicketIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{openTickets}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{resolvedTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* New Ticket Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            Submit New Ticket
          </button>
        </div>

        {/* New Ticket Form */}
        {showNewTicketForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Submit Support Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Please provide as much detail as possible..."
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
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="critical">Critical - System Down</option>
                    <option value="high">High - Major Impact</option>
                    <option value="medium">Medium - Partial Impact</option>
                    <option value="low">Low - Minor Issue</option>
                  </select>
                </div>
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
                  placeholder="Full address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketForm(false)}
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">My Tickets</h2>
          </div>

          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tickets yet. Submit your first support request!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-500">{ticket.ticketNumber}</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{ticket.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{ticket.siteLocation}</p>
                      <p className="text-xs text-gray-500">
                        Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="ml-4">
                      {expandedTicket === ticket.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedTicket === ticket.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
                      </div>

                      {ticket.notes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Updates from Support Team ({ticket.notes.length})
                          </h4>
                          <div className="space-y-3">
                            {ticket.notes.map(note => (
                              <div key={note.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-blue-900">{note.author}</span>
                                  <span className="text-xs text-blue-700">
                                    {format(new Date(note.createdAt), 'dd MMM yyyy, HH:mm')}
                                  </span>
                                </div>
                                <p className="text-sm text-blue-800">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {ticket.assignedTo && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>Assigned to:</strong> {ticket.assignedTo}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
