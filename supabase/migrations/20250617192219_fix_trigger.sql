-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;

-- Recreate the trigger
CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 