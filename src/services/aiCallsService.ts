import { supabase } from "@/integrations/supabase/client";
import { AiCall } from "@/types/aiCalls";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type AiCallRow = Tables<"ai_calls">;
type AiCallInsert = TablesInsert<"ai_calls">;
type AiCallUpdate = TablesUpdate<"ai_calls">;

export const aiCallsService = {
  async getAiCalls(): Promise<AiCall[]> {
    const { data, error } = await supabase
      .from('ai_calls')
      .select(`
        *,
        contact:contacts(
          first_name,
          last_name,
          email,
          company
        )
      `)
      .order('call_date', { ascending: false });

    if (error) {
      console.error('Error fetching AI calls:', error);
      throw error;
    }

    return data.map(call => ({
      ...call,
      contact: call.contact ? call.contact : undefined
    })) as AiCall[];
  },

  async createAiCall(callData: Partial<AiCall>): Promise<AiCall> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const insertData: AiCallInsert = {
      user_id: user.id,
      contact_id: callData.contact_id!,
      call_date: callData.call_date || new Date().toISOString(),
      duration: callData.duration,
      status: callData.status || 'successful',
      call_type: callData.call_type || 'outgoing',
      notes: callData.notes,
      summary: callData.summary,
      recording_url: callData.recording_url
    };

    const { data, error } = await supabase
      .from('ai_calls')
      .insert(insertData)
      .select(`
        *,
        contact:contacts(
          first_name,
          last_name,
          email,
          company
        )
      `)
      .single();

    if (error) {
      console.error('Error creating AI call:', error);
      throw error;
    }

    return {
      ...data,
      contact: data.contact ? data.contact : undefined
    } as AiCall;
  },

  async updateAiCall(id: string, updates: Partial<AiCall>): Promise<AiCall> {
    const updateData: AiCallUpdate = {};
    
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.status) updateData.status = updates.status;
    if (updates.call_type) updateData.call_type = updates.call_type;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.summary !== undefined) updateData.summary = updates.summary;
    if (updates.recording_url !== undefined) updateData.recording_url = updates.recording_url;

    const { data, error } = await supabase
      .from('ai_calls')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        contact:contacts(
          first_name,
          last_name,
          email,
          company
        )
      `)
      .single();

    if (error) {
      console.error('Error updating AI call:', error);
      throw error;
    }

    return {
      ...data,
      contact: data.contact ? data.contact : undefined
    } as AiCall;
  },

  async deleteAiCall(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_calls')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting AI call:', error);
      throw error;
    }
  }
};
