export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
export type TicketCategory = 'it-infrastructure' | 'it-network' | 'it-software' | 'it-hardware' | 'physical-security-cctv' | 'physical-security-access' | 'physical-security-alarm' | 'physical-security-other' | 'general';

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  assignedTo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  siteLocation: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  notes: TicketNote[];
  attachments: string[];
}

export interface TicketNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  criticalTickets: number;
  avgResolutionTime: string;
}
