// database_config.js
// Database connection configuration
// This file contains connection strings for reference
// Note: The project uses Supabase JS SDK (REST API), not direct PostgreSQL connections

// ============================================
// PostgreSQL Direct Connection String
// ============================================
// Use this if you need to connect via database client (pgAdmin, DBeaver, etc.)
// 
// Connection String:
// Note: If password contains special characters like @, use URL encoding
// @ should be encoded as %40
const POSTGRESQL_CONNECTION_STRING = 'postgresql://postgres:Shivam%409142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres';

// Alternative (if URL encoding doesn't work, use this format):
// postgresql://postgres:Shivam@9142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres

// ============================================
// Connection Details (Parsed)
// ============================================
const DATABASE_CONFIG = {
    host: 'db.fnqogmrilacriqbawahx.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Shivam@9142',
    connectionString: 'postgresql://postgres:Shivam%409142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres',
    connectionStringAlt: 'postgresql://postgres:Shivam@9142@db.fnqogmrilacriqbawahx.supabase.co:5432/postgres'
};

// ============================================
// Supabase Configuration (For Frontend)
// ============================================
// This is what the project actually uses
const SUPABASE_CONFIG = {
    url: 'https://fnqogmrilacriqbawahx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucW9nbXJpbGFjcmlxYmF3YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDIyMzEsImV4cCI6MjA3ODc3ODIzMX0.K9Gx4equuRYkR0zyYEXWtIYokDtBrMUVywa_nBszkdo'
};

// ============================================
// Usage Notes
// ============================================
// 
// 1. For Frontend (Current Project):
//    - Uses Supabase JS SDK (supabaseClient.js)
//    - No direct PostgreSQL connection needed
//    - Uses REST API via Supabase URL and anon key
//
// 2. For Database Clients (pgAdmin, DBeaver, etc.):
//    - Use POSTGRESQL_CONNECTION_STRING
//    - Or use individual connection parameters from DATABASE_CONFIG
//
// 3. Security Note:
//    - Never commit passwords to public repositories
//    - Use environment variables in production
//    - This file should be in .gitignore for production

// Export for use (if needed in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POSTGRESQL_CONNECTION_STRING,
        DATABASE_CONFIG,
        SUPABASE_CONFIG
    };
}

