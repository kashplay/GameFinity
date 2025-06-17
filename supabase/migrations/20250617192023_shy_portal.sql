/*
  # Create Cash Transactions Table

  1. New Tables
    - `cash_transactions`
      - `id` (uuid, primary key)
      - `game_session_id` (uuid, optional foreign key)
      - `txn_amount` (decimal, required)
      - `total_curr_amount` (decimal, required) - running balance
      - `description` (text, required)
      - `txn_type` (text, required) - CREDIT or DEBIT
      - `txn_date` (date, required)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `cash_transactions` table
    - Add policy for authenticated users to manage transactions

  3. Indexes
    - Index on game_session_id for faster lookups
    - Index on txn_date for date-based queries
*/

CREATE TABLE IF NOT EXISTS cash_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid REFERENCES game_sessions(id),
  txn_amount decimal(10,2) NOT NULL,
  total_curr_amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  txn_type text NOT NULL CHECK (txn_type IN ('CREDIT', 'DEBIT')),
  txn_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users"
  ON cash_transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cash_transactions_game_session_id 
  ON cash_transactions(game_session_id);

CREATE INDEX IF NOT EXISTS idx_cash_transactions_txn_date 
  ON cash_transactions(txn_date);

CREATE INDEX IF NOT EXISTS idx_cash_transactions_created_at 
  ON cash_transactions(created_at DESC);