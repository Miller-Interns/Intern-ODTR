// Import the 'dotenv' package to read the .env file
require('dotenv').config();

// Import the 'pg' library, the same one Kysely uses under the hood
const { Pool } = require('pg');

// Get the DATABASE_URL directly from the environment
const connectionString = process.env.POSTGRES_CONNECTION_URL;

console.log('--- Database Connection Test ---');

// Check if the connection string was loaded
if (!connectionString) {
  console.error('ERROR: DATABASE_URL not found in .env file.');
  process.exit(1); // Exit with an error
}

console.log('DATABASE_URL loaded. Attempting to connect...');
console.log('(Note: Part of the URL will be hidden for security)');

// Create a new pool with the connection string and SSL config
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // This is still very important
  },
});

// Use the pool to run a very simple query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    // If there's an error, print it clearly
    console.error('\n--- CONNECTION FAILED ---');
    console.error('Error details:', err);
  } else {
    // If it succeeds, print the result
    console.log('\n--- CONNECTION SUCCESSFUL ---');
    console.log('PostgreSQL server time:', res.rows[0].now);
  }
  
  // End the pool so the script can exit
  pool.end();
});