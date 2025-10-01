import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:quxbe5-xuqjah-giDbiw@db.aznouacxayahvisuczie.supabase.co:5432/postgres'
const sql = postgres(connectionString)

export default sql
