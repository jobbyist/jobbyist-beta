/**
 * Database Connection Configuration
 * 
 * This file provides a PostgreSQL connection using the postgres library.
 * It is not currently used in the frontend application.
 * 
 * For backend services or edge functions that need database access,
 * ensure the DATABASE_URL environment variable is properly configured.
 * 
 * Security: Never hardcode database credentials in source code.
 * Always use environment variables for sensitive configuration.
 */

import postgres from 'postgres'

// Database connection should use environment variable
// Never hardcode database credentials in source code
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please configure it in your environment or .env file. ' +
    'Never hardcode database credentials in source code.'
  )
}

const sql = postgres(connectionString)

export default sql
