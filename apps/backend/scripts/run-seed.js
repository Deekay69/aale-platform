// Quick script to seed lessons directly from terminal
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runSQLFile() {
    // Read DATABASE_URL from Railway
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ ERROR: DATABASE_URL environment variable not set!');
        console.log('\n📝 To fix this:');
        console.log('1. Go to Railway Dashboard → Backend Service → Variables');
        console.log('2. Copy the DATABASE_URL value');
        console.log('3. Create a .env file in the root with: DATABASE_URL=<paste_here>');
        console.log('\nOr run: set DATABASE_URL=<paste_here> (Windows)');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔌 Connecting to Railway database...\n');

        const sqlFile = path.join(__dirname, '..', 'migrations', 'seed-kenyan-lessons.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📚 Executing SQL seed file...\n');
        await pool.query(sql);

        console.log('✅ Success! Lessons have been seeded.\n');

        // Verify
        const result = await pool.query('SELECT COUNT(*) as total, subject FROM lessons GROUP BY subject');
        console.log('📊 Lesson Summary:');
        console.table(result.rows);

    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

runSQLFile();
