import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

export type CampaignTemplate = Database['public']['Tables']['campaign_templates']['Row'];
export type CampaignTemplateInsert = Database['public']['Tables']['campaign_templates']['Insert'];

export const campaignsService = {
  // Get all campaigns for the current user
  async getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single campaign by ID
  async getCampaign(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new campaign
  async createCampaign(campaign: CampaignInsert): Promise<Campaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert({ ...campaign, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update campaign
  async updateCampaign(id: string, updates: CampaignUpdate): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete campaign
  async deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Duplicate campaign
  async duplicateCampaign(id: string): Promise<Campaign> {
    const original = await this.getCampaign(id);
    if (!original) throw new Error('Campaign not found');

    const { id: _, created_at, updated_at, user_id, ...campaignData } = original;
    
    return this.createCampaign({
      ...campaignData,
      name: `${campaignData.name} (Kopie)`,
      status: 'draft',
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
    });
  },

  // Get templates
  async getTemplates(): Promise<CampaignTemplate[]> {
    const { data, error } = await supabase
      .from('campaign_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create template
  async createTemplate(template: CampaignTemplateInsert): Promise<CampaignTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaign_templates')
      .insert({ ...template, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get contacts by list name for recipients
  async getContactsByList(listName?: string): Promise<any[]> {
    let query = supabase
      .from('contacts')
      .select('*');

    if (listName) {
      query = query.eq('list_name', listName);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get unique list names
  async getListNames(): Promise<string[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('list_name')
      .not('list_name', 'is', null);

    if (error) throw error;
    
    const uniqueNames = [...new Set(data?.map(item => item.list_name).filter(Boolean))];
    return uniqueNames;
  }
};
