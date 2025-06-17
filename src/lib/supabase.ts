import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('supabaseUrl', supabaseUrl);
console.log('supabaseAnonKey', supabaseAnonKey);
console.log('import.meta.env', import.meta.env);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      game_sessions: {
        Row: {
          id: string;
          customer_name: string;
          controller_count: number;
          game_type: 'screen1' | 'screen2' | 'screen3' | 'screen4' | 'pool';
          start_time: string;
          end_time: string | null;
          duration: number | null;
          calculated_price: number;
          total_price: number;
          cash_received: number;
          online_received: number;
          status: 'ACTIVE' | 'COMPLETED';
          is_mismatch: boolean | null;
          mismatch_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          controller_count: number;
          game_type: 'screen1' | 'screen2' | 'screen3' | 'screen4' | 'pool';
          start_time: string;
          end_time?: string | null;
          duration?: number | null;
          calculated_price?: number;
          total_price?: number;
          cash_received?: number;
          online_received?: number;
          status?: 'ACTIVE' | 'COMPLETED';
          is_mismatch?: boolean | null;
          mismatch_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          controller_count?: number;
          game_type?: 'screen1' | 'screen2' | 'screen3' | 'screen4' | 'pool';
          start_time?: string;
          end_time?: string | null;
          duration?: number | null;
          calculated_price?: number;
          total_price?: number;
          cash_received?: number;
          online_received?: number;
          status?: 'ACTIVE' | 'COMPLETED';
          is_mismatch?: boolean | null;
          mismatch_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cash_transactions: {
        Row: {
          id: string;
          game_session_id: string | null;
          txn_amount: number;
          total_curr_amount: number;
          description: string;
          txn_type: 'CREDIT' | 'DEBIT';
          txn_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_session_id?: string | null;
          txn_amount: number;
          total_curr_amount: number;
          description: string;
          txn_type: 'CREDIT' | 'DEBIT';
          txn_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_session_id?: string | null;
          txn_amount?: number;
          total_curr_amount?: number;
          description?: string;
          txn_type?: 'CREDIT' | 'DEBIT';
          txn_date?: string;
          created_at?: string;
        };
      };
    };
  };
}