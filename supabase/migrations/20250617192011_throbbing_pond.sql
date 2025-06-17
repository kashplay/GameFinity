/*
  # Create Game Sessions Table

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `customer_name` (text, required)
      - `controller_count` (integer, required)
      - `game_type` (text, required)
      - `start_time` (timestamptz, required)
      - `end_time` (timestamptz, optional)
      - `duration` (integer, optional) - duration in minutes
      - `calculated_price` (decimal, required)
      - `total_price` (decimal, required)
      - `cash_received` (decimal, required)
      - `online_received` (decimal, required)
      - `status` (text, required) - ACTIVE or COMPLETED
      - `is_mismatch` (boolean, default false)
      - `mismatch_reason` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `game_sessions` table
    - Add policy for authenticated users to manage sessions
*/

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  controller_count integer NOT NULL CHECK (controller_count >= 1 AND controller_count <= 4),
  game_type text NOT NULL CHECK (game_type IN ('screen1', 'screen2', 'screen3', 'screen4', 'pool')),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration integer, -- duration in minutes
  calculated_price decimal(10,2) NOT NULL DEFAULT 0,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  cash_received decimal(10,2) NOT NULL DEFAULT 0,
  online_received decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED')),
  is_mismatch boolean DEFAULT false,
  mismatch_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users"
  ON game_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();