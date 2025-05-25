import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/crm";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Contact = Tables<"contacts">;
type ContactInsert = TablesInsert<"contacts">;
type ContactUpdate = TablesUpdate<"contacts">;

// Map Supabase contact to CRM Lead
export const mapContactToLead = (contact: Contact): Lead => {
  return {
    id: contact.id,
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
    email: contact.email || '',
    phone: contact.phone || '',
    company: contact.company || '', // Now properly map the company field
    status: (contact.status as Lead['status']) || 'new',
    source: contact.source || 'Unknown',
    value: 0, // We'll need to add value field to contacts table later
    assignedTo: '', // We'll need to add assigned_to field to contacts table later
    createdAt: contact.created_at ? new Date(contact.created_at).toISOString().split('T')[0] : '',
    lastContact: contact.created_at ? new Date(contact.created_at).toISOString().split('T')[0] : '',
    notes: contact.notes || '',
    gdprConsent: true // Assume consent for existing contacts
  };
};

// Map CRM Lead to Supabase contact insert
export const mapLeadToContactInsert = (lead: Partial<Lead>, userId: string): ContactInsert => {
  // Handle both old name field and new firstName/lastName fields
  let firstName = lead.first_name || '';
  let lastName = lead.last_name || '';
  
  // If we have the old name field but not the new ones, split it
  if (lead.name && !firstName && !lastName) {
    const nameParts = lead.name.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }
  
  return {
    first_name: firstName,
    last_name: lastName,
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '', // Now properly map the company field
    notes: lead.notes || '',
    source: lead.source || 'Website',
    status: lead.status || 'new',
    user_id: userId
  };
};

export const contactsService = {
  async getContacts(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }

    return data.map(mapContactToLead);
  },

  async createContact(lead: Partial<Lead>): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const contactData = mapLeadToContactInsert(lead, user.id);
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }

    return mapContactToLead(data);
  },

  async updateContact(id: string, updates: Partial<Lead>): Promise<Lead> {
    const updateData: ContactUpdate = {};
    
    // Handle name updates
    if (updates.first_name !== undefined) updateData.first_name = updates.first_name;
    if (updates.last_name !== undefined) updateData.last_name = updates.last_name;
    
    // If we have the old name field, split it
    if (updates.name && !updates.first_name && !updates.last_name) {
      const nameParts = updates.name.split(' ');
      updateData.first_name = nameParts[0] || '';
      updateData.last_name = nameParts.slice(1).join(' ') || '';
    }
    
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.company !== undefined) updateData.company = updates.company; // Now properly handle company updates
    if (updates.notes) updateData.notes = updates.notes;
    if (updates.source) updateData.source = updates.source;
    if (updates.status) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      throw error;
    }

    return mapContactToLead(data);
  },

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
};
