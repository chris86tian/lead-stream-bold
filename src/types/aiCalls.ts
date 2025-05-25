export interface AiCall {
  id: string;
  user_id: string;
  contact_id: string;
  call_date: string;
  duration?: number;
  status: 'successful' | 'failed' | 'no_answer' | 'busy';
  call_type: 'outgoing' | 'incoming';
  notes?: string;
  summary?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
  // Joined contact data
  contact?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    company?: string;
  };
}
