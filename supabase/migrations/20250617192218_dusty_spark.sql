/*
# Gaming Center Management System Database Setup

This file contains the complete database schema for the gaming center management system.

## Tables Created:
1. **game_sessions** - Tracks gaming sessions with customer info, pricing, and status
2. **cash_transactions** - Records all cash flow transactions

## Features:
- Row Level Security (RLS) enabled on all tables
- Automatic timestamp updates
- Data validation constraints
- Proper indexing for performance

## Instructions:
1. Copy this entire SQL content
2. Go to your Supabase project dashboard
3. Navigate to SQL Editor
4. Paste and execute this SQL
*/

-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    controller_count integer NOT NULL CHECK (controller_count >= 1 AND controller_count <= 4),
    game_type text NOT NULL CHECK (game_type IN ('screen1', 'screen2', 'screen3', 'screen4', 'pool')),
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    duration integer,
    calculated_price numeric(10,2) NOT NULL DEFAULT 0,
    total_price numeric(10,2) NOT NULL DEFAULT 0,
    cash_received numeric(10,2) NOT NULL DEFAULT 0,
    online_received numeric(10,2) NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED')),
    is_mismatch boolean DEFAULT false,
    mismatch_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create cash_transactions table
CREATE TABLE IF NOT EXISTS cash_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id uuid REFERENCES game_sessions(id),
    txn_amount numeric(10,2) NOT NULL,
    total_curr_amount numeric(10,2) NOT NULL,
    description text NOT NULL,
    txn_type text NOT NULL CHECK (txn_type IN ('CREDIT', 'DEBIT')),
    txn_date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cash_transactions_created_at ON cash_transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cash_transactions_game_session_id ON cash_transactions (game_session_id);
CREATE INDEX IF NOT EXISTS idx_cash_transactions_txn_date ON cash_transactions (txn_date);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON game_sessions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON cash_transactions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);