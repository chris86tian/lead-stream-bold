export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string; // Changed from specific union type to string to handle any status from database
  source?: string;
  value?: number;
  assignedTo?: string;
  createdAt?: string;
  lastContact?: string;
  notes?: string;
  gdprConsent?: boolean;
  // Additional fields from Supabase
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
  user_id?: string;
}

export interface CommunicationEntry {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string;
  content: string;
  timestamp: string;
  automatedBy?: string;
}

export interface Stats {
  totalLeads: number;
  newLeads: number;
  interestedLeads: number;
  qualifiedLeads: number;
  totalValue: number;
  conversionRate: number;
}
