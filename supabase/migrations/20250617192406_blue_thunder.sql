/*
  # Game Shop Tracker Database Schema

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `customer_name` (text, required)
      - `controller_count` (integer, 1-4)
      - `game_type` (text, screen1-4 or pool)
      - `start_time` (timestamptz, required)
      - `end_time` (timestamptz, optional)
      - `duration` (integer, minutes)
      - `calculated_price` (numeric, default 0)
      - `total_price` (numeric, default 0)
      - `cash_received` (numeric, default 0)
      - `online_received` (numeric, default 0)
      - `status` (text, ACTIVE/COMPLETED)
      - `is_mismatch` (boolean, default false)
      - `mismatch_reason` (text, optional)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

    - `cash_transactions`
      - `id` (uuid, primary key)
      - `game_session_id` (uuid, foreign key)
      - `txn_amount` (numeric, required)
      - `total_curr_amount` (numeric, required)
      - `description` (text, required)
      - `txn_type` (text, CREDIT/DEBIT)
      - `txn_date` (date, required)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform all operations

  3. Performance
    - Add indexes on frequently queried columns
    - Add trigger for automatic updated_at timestamp
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
DROP FUNCTION IF EXISTS update_updated_at_column();

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

-- Create indexes for better performance (drop first if they exist)
DROP INDEX IF EXISTS idx_cash_transactions_created_at;
DROP INDEX IF EXISTS idx_cash_transactions_game_session_id;
DROP INDEX IF EXISTS idx_cash_transactions_txn_date;

CREATE INDEX idx_cash_transactions_created_at ON cash_transactions (created_at DESC);
CREATE INDEX idx_cash_transactions_game_session_id ON cash_transactions (game_session_id);
CREATE INDEX idx_cash_transactions_txn_date ON cash_transactions (txn_date);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON game_sessions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON cash_transactions;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON game_sessions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON cash_transactions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);