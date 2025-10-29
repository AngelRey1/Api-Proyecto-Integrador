import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/shared/config/environment';

class SupabaseConnection {
  private static instance: SupabaseConnection;
  private client: SupabaseClient;

  private constructor() {
    this.client = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  public static getInstance(): SupabaseConnection {
    if (!SupabaseConnection.instance) {
      SupabaseConnection.instance = new SupabaseConnection();
    }
    return SupabaseConnection.instance;
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.client.from('_test').select('*').limit(1);
      return !error || error.code !== 'PGRST301'; // Table not found is OK for connection test
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }
}

export const supabaseClient = SupabaseConnection.getInstance().getClient();
export const supabaseConnection = SupabaseConnection.getInstance();