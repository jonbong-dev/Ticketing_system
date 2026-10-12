import { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from './types';
import { getTickets, createTicket, updateTicket, addNote, deleteTicket } from './store';
import { LayoutDashboard, Ticket as TicketIcon, PlusCircle, Search, Filter, Clock, AlertTriangle, CheckCircle, ChevronRight, ArrowLeft, Trash2, MessageSquare, Shield, Server, Network, Monitor, Lock, Bell, Users, BarChart3, TrendingUp } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

type View = 'dashboard' | 'tickets' | 'create' | 'detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<TicketCategory | 'all'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const refreshTickets = () => {
    setTickets(getTickets());
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length,
    high: tickets.filter(t => t.priority === 'high' && t.status !== 'resolved' && t.status !== 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0a1628] text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              JEB
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm leading-tight">JEB Innovations</h1>
                <p className="text-xs text-gray-400">& Technologies</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span className="text-sm">Dashboard</span>}
          </button>
          <button
            onClick={() => setCurrentView('tickets')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'tickets' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          >
            <TicketIcon size={20} />
            {sidebarOpen && <span className="text-sm">All Tickets</span>}
            {sidebarOpen && <span className="ml-auto bg-blue-500/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">{stats.total}</span>}
          </button>
          <button
            onClick={() => setCurrentView('create')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'create' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          >
            <PlusCircle size={20} />
            {sidebarOpen && <span className="text-sm">New Ticket</span>}
          </button>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">IT & Physical Security</p>
              <p className="text-xs text-gray-500 mt-1">Support Portal v1.0</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'tickets' && 'Ticket Management'}
                {currentView === 'create' && 'Create New Ticket'}
                {currentView === 'detail' && `Ticket ${selectedTicket?.ticketNumber || ''}`}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); if (currentView !== 'tickets') setCurrentView('tickets'); }}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
                />
              </div>
              <button
                onClick={() => setCurrentView('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <PlusCircle size={16} />
                New Ticket
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {currentView === 'dashboard' && (
            <DashboardView stats={stats} tickets={tickets} onViewTicket={(id: string) => { setSelectedTicketId(id); setCurrentView('detail'); }} onNewTicket={() => setCurrentView('create')} />
          )}
          {currentView === 'tickets' && (
            <TicketListView
              tickets={filteredTickets}
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              filterCategory={filterCategory}
              onFilterStatus={setFilterStatus}
              onFilterPriority={setFilterPriority}
              onFilterCategory={setFilterCategory}
              onViewTicket={(id: string) => { setSelectedTicketId(id); setCurrentView('detail'); }}
              onDeleteTicket={(id: string) => { deleteTicket(id); refreshTickets(); }}
            />
          )}
          {currentView === 'create' && (
            <TicketFormView
              onSubmit={(data) => { createTicket(data); refreshTickets(); setCurrentView('tickets'); }}
              onCancel={() => setCurrentView('tickets')}
            />
          )}
          {currentView === 'detail' && selectedTicket && (
            <TicketDetailView
              ticket={selectedTicket}
              onBack={() => setCurrentView('tickets')}
              onUpdate={(updates) => { updateTicket(selectedTicket.id, updates); refreshTickets(); }}
              onAddNote={(note) => { addNote(selectedTicket.id, note); refreshTickets(); }}
              onDelete={() => { deleteTicket(selectedTicket.id); refreshTickets(); setCurrentView('tickets'); }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Dashboard View
function DashboardView({ stats, tickets, onViewTicket, onNewTicket }: { stats: any; tickets: Ticket[]; onViewTicket: (id: string) => void; onNewTicket: () => void }) {
  const recentTickets = tickets.slice(0, 5);
  const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TicketIcon className="text-blue-600" size={24} />} label="Total Tickets" value={stats.total} color="blue" />
        <StatCard icon={<Clock className="text-amber-600" size={24} />} label="Open / In Progress" value={stats.open + stats.inProgress} color="amber" />
        <StatCard icon={<AlertTriangle className="text-red-600" size={24} />} label="Critical" value={stats.critical} color="red" />
        <StatCard icon={<CheckCircle className="text-green-600" size={24} />} label="Resolved" value={stats.resolved} color="green" />
      </div>

      {/* Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={18} /> Ticket Distribution
          </h3>
          <div className="space-y-3">
            <PriorityBar label="Critical" count={stats.critical} total={stats.total} color="bg-red-500" />
            <PriorityBar label="High" count={stats.high} total={stats.total} color="bg-orange-500" />
            <PriorityBar label="Medium" count={tickets.filter(t => t.priority === 'medium' && t.status !== 'resolved' && t.status !== 'closed').length} total={stats.total} color="bg-yellow-500" />
            <PriorityBar label="Low" count={tickets.filter(t => t.priority === 'low' && t.status !== 'resolved' && t.status !== 'closed').length} total={stats.total} color="bg-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Quick Actions
          </h3>
          <div className="space-y-3">
            <button onClick={onNewTicket} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <PlusCircle size={16} /> Create New Ticket
            </button>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800">⚠️ Attention Required</p>
              <p className="text-xs text-red-600 mt-1">{criticalTickets.length} critical ticket(s) need immediate attention</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800">📊 Status Summary</p>
              <div className="mt-2 space-y-1 text-xs text-blue-700">
                <p>Open: {stats.open}</p>
                <p>In Progress: {stats.inProgress}</p>
                <p>Pending: {stats.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Tickets</h3>
        <div className="space-y-2">
          {recentTickets.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => onViewTicket(ticket.id)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <PriorityDot priority={ticket.priority} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{ticket.title}</p>
                <p className="text-xs text-gray-500">{ticket.ticketNumber} • {ticket.customerName}</p>
              </div>
              <StatusBadge status={ticket.status} />
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ticket List View
function TicketListView({ tickets, filterStatus, filterPriority, filterCategory, onFilterStatus, onFilterPriority, onFilterCategory, onViewTicket, onDeleteTicket }: { tickets: Ticket[]; filterStatus: TicketStatus | 'all'; filterPriority: TicketPriority | 'all'; filterCategory: TicketCategory | 'all'; onFilterStatus: (s: TicketStatus | 'all') => void; onFilterPriority: (p: TicketPriority | 'all') => void; onFilterCategory: (c: TicketCategory | 'all') => void; onViewTicket: (id: string) => void; onDeleteTicket: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-gray-500" />
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value as TicketStatus | 'all')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => onFilterPriority(e.target.value as TicketPriority | 'all')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategory(e.target.value as TicketCategory | 'all')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Categories</option>
          <option value="it-infrastructure">IT - Infrastructure</option>
          <option value="it-network">IT - Network</option>
          <option value="it-software">IT - Software</option>
          <option value="it-hardware">IT - Hardware</option>
          <option value="physical-security-cctv">Security - CCTV</option>
          <option value="physical-security-access">Security - Access Control</option>
          <option value="physical-security-alarm">Security - Alarm Systems</option>
          <option value="physical-security-other">Security - Other</option>
          <option value="general">General</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">{tickets.length} ticket(s)</span>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <TicketIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tickets found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => onViewTicket(ticket.id)}
              >
                <PriorityDot priority={ticket.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{ticket.ticketNumber}</span>
                    <CategoryBadge category={ticket.category} />
                  </div>
                  <p className="text-sm font-medium text-gray-800 mt-1 truncate">{ticket.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{ticket.customerName} • {ticket.siteLocation}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={ticket.status} />
                  <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteTicket(ticket.id); }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Ticket Form View
function TicketFormView({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'it-infrastructure' as TicketCategory,
    priority: 'medium' as TicketPriority,
    status: 'open' as TicketStatus,
    createdBy: '',
    assignedTo: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    siteLocation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">New Support Ticket</h3>
          <p className="text-sm text-gray-500">Fill in the details below to create a new ticket</p>
        </div>

        {/* Customer Information */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2"><Users size={16} /> Customer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer Name" required>
              <input type="text" required value={form.customerName} onChange={(e) => setForm({...form, customerName: e.target.value})} className="input-field" placeholder="Company / Contact name" />
            </FormField>
            <FormField label="Email">
              <input type="email" value={form.customerEmail} onChange={(e) => setForm({...form, customerEmail: e.target.value})} className="input-field" placeholder="email@company.sg" />
            </FormField>
            <FormField label="Phone">
              <input type="text" value={form.customerPhone} onChange={(e) => setForm({...form, customerPhone: e.target.value})} className="input-field" placeholder="+65 XXXX XXXX" />
            </FormField>
            <FormField label="Site Location" required>
              <input type="text" required value={form.siteLocation} onChange={(e) => setForm({...form, siteLocation: e.target.value})} className="input-field" placeholder="Full address" />
            </FormField>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2"><TicketIcon size={16} /> Ticket Details</h4>
          <FormField label="Title" required>
            <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field" placeholder="Brief description of the issue" />
          </FormField>
          <FormField label="Description" required>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" placeholder="Detailed description of the issue..." />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Category" required>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value as TicketCategory})} className="input-field">
                <optgroup label="IT Services">
                  <option value="it-infrastructure">Infrastructure</option>
                  <option value="it-network">Network</option>
                  <option value="it-software">Software</option>
                  <option value="it-hardware">Hardware</option>
                </optgroup>
                <optgroup label="Physical Security">
                  <option value="physical-security-cctv">CCTV Systems</option>
                  <option value="physical-security-access">Access Control</option>
                  <option value="physical-security-alarm">Alarm Systems</option>
                  <option value="physical-security-other">Other Security</option>
                </optgroup>
                <option value="general">General</option>
              </select>
            </FormField>
            <FormField label="Priority" required>
              <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value as TicketPriority})} className="input-field">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </FormField>
            <FormField label="Assigned To">
              <select value={form.assignedTo} onChange={(e) => setForm({...form, assignedTo: e.target.value})} className="input-field">
                <option value="">Unassigned</option>
                <option value="John Tan">John Tan</option>
                <option value="Sarah Lim">Sarah Lim</option>
                <option value="Ahmad Razak">Ahmad Razak</option>
                <option value="David Wong">David Wong</option>
              </select>
            </FormField>
          </div>
          <FormField label="Created By" required>
            <input type="text" required value={form.createdBy} onChange={(e) => setForm({...form, createdBy: e.target.value})} className="input-field" placeholder="Your name" />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Create Ticket</button>
        </div>
      </form>
    </div>
  );
}

// Ticket Detail View
function TicketDetailView({ ticket, onBack, onUpdate, onAddNote, onDelete }: { ticket: Ticket; onBack: () => void; onUpdate: (updates: Partial<Ticket>) => void; onAddNote: (note: { author: string; content: string }) => void; onDelete: () => void }) {
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim() && noteAuthor.trim()) {
      onAddNote({ author: noteAuthor, content: noteText });
      setNoteText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500">{ticket.ticketNumber}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mt-1">{ticket.title}</h2>
        </div>
        <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={18} />
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm text-red-800">Are you sure you want to delete this ticket?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-700 hover:bg-red-100">Cancel</button>
            <button onClick={onDelete} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> Notes & Updates ({ticket.notes.length})
            </h3>
            {ticket.notes.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No notes yet</p>
            ) : (
              <div className="space-y-4 mb-6">
                {ticket.notes.map(note => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{note.author}</span>
                      <span className="text-xs text-gray-400">{format(new Date(note.createdAt), 'dd MMM yyyy, HH:mm')}</span>
                    </div>
                    <p className="text-sm text-gray-600">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddNote} className="border-t border-gray-100 pt-4 space-y-3">
              <input
                type="text"
                value={noteAuthor}
                onChange={(e) => setNoteAuthor(e.target.value)}
                placeholder="Your name"
                required
                className="input-field"
              />
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note or update..."
                rows={3}
                required
                className="input-field"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Ticket Properties</h3>
            
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Status</label>
              <select
                value={ticket.status}
                onChange={(e) => onUpdate({ status: e.target.value as TicketStatus })}
                className="input-field mt-1"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Priority</label>
              <select
                value={ticket.priority}
                onChange={(e) => onUpdate({ priority: e.target.value as TicketPriority })}
                className="input-field mt-1"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</label>
              <select
                value={ticket.assignedTo}
                onChange={(e) => onUpdate({ assignedTo: e.target.value })}
                className="input-field mt-1"
              >
                <option value="">Unassigned</option>
                <option value="John Tan">John Tan</option>
                <option value="Sarah Lim">Sarah Lim</option>
                <option value="Ahmad Razak">Ahmad Razak</option>
                <option value="David Wong">David Wong</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Category</label>
              <div className="mt-1"><CategoryBadge category={ticket.category} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Customer Details</h3>
            <DetailRow label="Name" value={ticket.customerName} />
            <DetailRow label="Email" value={ticket.customerEmail} />
            <DetailRow label="Phone" value={ticket.customerPhone} />
            <DetailRow label="Location" value={ticket.siteLocation} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Timeline</h3>
            <DetailRow label="Created" value={format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm')} />
            <DetailRow label="Updated" value={format(new Date(ticket.updatedAt), 'dd MMM yyyy, HH:mm')} />
            {ticket.resolvedAt && <DetailRow label="Resolved" value={format(new Date(ticket.resolvedAt), 'dd MMM yyyy, HH:mm')} />}
            <DetailRow label="Created By" value={ticket.createdBy} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-100',
    amber: 'bg-amber-50 border-amber-100',
    red: 'bg-red-50 border-red-100',
    green: 'bg-green-50 border-green-100',
  };
  return (
    <div className={`rounded-xl border p-5 ${bgColors[color] || 'bg-gray-50 border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

function PriorityBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-16">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    'open': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    'pending': 'bg-purple-100 text-purple-700',
    'resolved': 'bg-green-100 text-green-700',
    'closed': 'bg-gray-100 text-gray-600',
  };
  const labels: Record<TicketStatus, string> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'pending': 'Pending',
    'resolved': 'Resolved',
    'closed': 'Closed',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const styles: Record<TicketPriority, string> = {
    'critical': 'bg-red-100 text-red-700',
    'high': 'bg-orange-100 text-orange-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function PriorityDot({ priority }: { priority: TicketPriority }) {
  const colors: Record<TicketPriority, string> = {
    'critical': 'bg-red-500',
    'high': 'bg-orange-500',
    'medium': 'bg-yellow-500',
    'low': 'bg-blue-400',
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[priority]} flex-shrink-0`} />;
}

function CategoryBadge({ category }: { category: TicketCategory }) {
  const labels: Record<TicketCategory, { label: string; icon: React.ReactNode }> = {
    'it-infrastructure': { label: 'IT Infra', icon: <Server size={10} /> },
    'it-network': { label: 'Network', icon: <Network size={10} /> },
    'it-software': { label: 'Software', icon: <Monitor size={10} /> },
    'it-hardware': { label: 'Hardware', icon: <Monitor size={10} /> },
    'physical-security-cctv': { label: 'CCTV', icon: <Shield size={10} /> },
    'physical-security-access': { label: 'Access', icon: <Lock size={10} /> },
    'physical-security-alarm': { label: 'Alarm', icon: <Bell size={10} /> },
    'physical-security-other': { label: 'Security', icon: <Shield size={10} /> },
    'general': { label: 'General', icon: <TicketIcon size={10} /> },
  };
  const { label, icon } = labels[category];
  const isSecurity = category.startsWith('physical-security');
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${isSecurity ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
      {icon} {label}
    </span>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  );
}

export default App;
