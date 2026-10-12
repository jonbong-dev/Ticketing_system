import { Ticket, TicketNote } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'jeb_tickets';
const COUNTER_KEY = 'jeb_ticket_counter';

export function getTickets(): Ticket[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const sampleTickets = generateSampleTickets();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTickets));
    return sampleTickets;
  }
  return JSON.parse(data);
}

export function saveTickets(tickets: Ticket[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export function getTicketById(id: string): Ticket | undefined {
  const tickets = getTickets();
  return tickets.find(t => t.id === id);
}

export function createTicket(ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'notes' | 'attachments'>): Ticket {
  const tickets = getTickets();
  const counter = getNextCounter();
  
  const newTicket: Ticket = {
    ...ticketData,
    id: uuidv4(),
    ticketNumber: `JEB-${String(counter).padStart(4, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    attachments: [],
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);
  return newTicket;
}

export function updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === id);
  if (index === -1) return undefined;

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.status === 'resolved' || updates.status === 'closed') {
    tickets[index].resolvedAt = new Date().toISOString();
  }

  saveTickets(tickets);
  return tickets[index];
}

export function addNote(ticketId: string, note: Omit<TicketNote, 'id' | 'createdAt'>): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return undefined;

  const newNote: TicketNote = {
    ...note,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  tickets[index].notes.push(newNote);
  tickets[index].updatedAt = new Date().toISOString();
  saveTickets(tickets);
  return tickets[index];
}

export function deleteTicket(id: string): boolean {
  const tickets = getTickets();
  const filtered = tickets.filter(t => t.id !== id);
  if (filtered.length === tickets.length) return false;
  saveTickets(filtered);
  return true;
}

function getNextCounter(): number {
  const counter = parseInt(localStorage.getItem(COUNTER_KEY) || '0') + 1;
  localStorage.setItem(COUNTER_KEY, String(counter));
  return counter;
}

function generateSampleTickets(): Ticket[] {
  const now = new Date();
  const tickets: Ticket[] = [
    {
      id: uuidv4(),
      ticketNumber: 'JEB-0001',
      title: 'CCTV System Not Recording at Client Office',
      description: 'The CCTV system at the client\'s main office has stopped recording. The cameras show live feed but no footage is being saved to the NVR. Client reports this started 2 days ago.',
      category: 'physical-security-cctv',
      priority: 'high',
      status: 'in-progress',
      createdBy: 'John Tan',
      assignedTo: 'Ahmad Razak',
      customerName: 'ABC Corporation',
      customerEmail: 'it@abccorp.sg',
      customerPhone: '+65 6123 4567',
      siteLocation: '10 Anson Road, #15-01, Singapore 079903',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      notes: [
        { id: uuidv4(), author: 'Ahmad Razak', content: 'Visited site. NVR hard drive showing errors. Ordering replacement drive.', createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() }
      ],
      attachments: [],
    },
    {
      id: uuidv4(),
      ticketNumber: 'JEB-0002',
      title: 'Firewall Firmware Update Required',
      description: 'Annual firewall firmware update needed for the client\'s FortiGate 100F. Security advisory recommends immediate update due to CVE-2024-XXXX.',
      category: 'it-network',
      priority: 'critical',
      status: 'open',
      createdBy: 'Sarah Lim',
      assignedTo: 'John Tan',
      customerName: 'XYZ Financial Services',
      customerEmail: 'admin@xyzfinancial.sg',
      customerPhone: '+65 6234 5678',
      siteLocation: '8 Marina View, #20-01, Singapore 018960',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      notes: [],
      attachments: [],
    },
    {
      id: uuidv4(),
      ticketNumber: 'JEB-0003',
      title: 'Access Card System - New Employee Setup',
      description: 'Client needs 5 new access cards programmed for new employees joining next Monday. Cards need access to floors 3-5 and server room.',
      category: 'physical-security-access',
      priority: 'medium',
      status: 'pending',
      createdBy: 'Ahmad Razak',
      assignedTo: 'Sarah Lim',
      customerName: 'TechHub Solutions',
      customerEmail: 'facilities@techhub.sg',
      customerPhone: '+65 6345 6789',
      siteLocation: '71 Robinson Road, #10-01, Singapore 068895',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      notes: [
        { id: uuidv4(), author: 'Sarah Lim', content: 'Waiting for employee details from client. Follow-up email sent.', createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString() }
      ],
      attachments: [],
    },
    {
      id: uuidv4(),
      ticketNumber: 'JEB-0004',
      title: 'Network Switch Replacement - Floor 2',
      description: 'Core switch on floor 2 showing intermittent failures. Need to replace with new Cisco Catalyst 9300. Client approved the quote.',
      category: 'it-infrastructure',
      priority: 'high',
      status: 'open',
      createdBy: 'John Tan',
      assignedTo: 'John Tan',
      customerName: 'Global Logistics Pte Ltd',
      customerEmail: 'it@globallogistics.sg',
      customerPhone: '+65 6456 7890',
      siteLocation: '152 Beach Road, #08-01, Singapore 189721',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: [],
      attachments: [],
    },
    {
      id: uuidv4(),
      ticketNumber: 'JEB-0005',
      title: 'Alarm System False Alerts',
      description: 'Client reporting multiple false alarm triggers from their perimeter detection system. Possibly sensor misalignment after recent construction nearby.',
      category: 'physical-security-alarm',
      priority: 'medium',
      status: 'resolved',
      createdBy: 'Sarah Lim',
      assignedTo: 'Ahmad Razak',
      customerName: 'Premium Residences MCST',
      customerEmail: 'mcst@premiumresidences.sg',
      customerPhone: '+65 6567 8901',
      siteLocation: '33 Boulevard Walk, Singapore 259674',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: [
        { id: uuidv4(), author: 'Ahmad Razak', content: 'Recalibrated all perimeter sensors. Tested for 24 hours - no false alerts.', createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() }
      ],
      attachments: [],
    },
    {
      id: uuidv4(),
      ticketNumber: 'JEB-0006',
      title: 'Office 365 License Migration',
      description: 'Migrating 50 users from Office 365 Business Premium to E3 licenses. Need to ensure all data is preserved during transition.',
      category: 'it-software',
      priority: 'low',
      status: 'in-progress',
      createdBy: 'John Tan',
      assignedTo: 'Sarah Lim',
      customerName: 'Pacific Trading Co',
      customerEmail: 'admin@pacifictrading.sg',
      customerPhone: '+65 6678 9012',
      siteLocation: '50 Raffles Place, #32-01, Singapore 048623',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: [
        { id: uuidv4(), author: 'Sarah Lim', content: 'Migration in progress. 30/50 users completed. Remaining users scheduled for weekend.', createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }
      ],
      attachments: [],
    },
  ];

  localStorage.setItem(COUNTER_KEY, '6');
  return tickets;
}
