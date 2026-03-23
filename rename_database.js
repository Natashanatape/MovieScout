const { Client } = require('pg');
require('dotenv').config();

async function renameDatabase() {
    // Connect to postgres database (not the target database)
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres', // Connect to postgres database
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Check if imdb_clone exists
        const checkImdbClone = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'imdb_clone'"
        );

        // Check if MovieScout exists
        const checkMovieScout = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'MovieScout'"
        );

        if (checkImdbClone.rows.length > 0) {
            if (checkMovieScout.rows.length > 0) {
                console.log('❌ Both imdb_clone and MovieScout databases exist!');
                console.log('Please manually drop one of them first.');
                return;
            }

            console.log('📋 Found imdb_clone database. Renaming to MovieScout...');
            
            // Terminate active connections
            await client.query(`
                SELECT pg_terminate_backend(pid) 
                FROM pg_stat_activity 
                WHERE datname = 'imdb_clone' AND pid <> pg_backend_pid()
            `);

            // Rename database
            await client.query('ALTER DATABASE imdb_clone RENAME TO "MovieScout"');
            console.log('✅ Database renamed successfully: imdb_clone → MovieScout');

        } else if (checkMovieScout.rows.length > 0) {
            console.log('✅ MovieScout database already exists. No action needed.');
        } else {
            console.log('📋 Neither database exists. Creating MovieScout...');
            await client.query('CREATE DATABASE "MovieScout"');
            console.log('✅ MovieScout database created successfully!');
        }

        // Verify the result
        const verify = await client.query(
            "SELECT datname FROM pg_database WHERE datname = 'MovieScout'"
        );
        
        if (verify.rows.length > 0) {
            console.log('🎉 MovieScout database is ready!');
        } else {
            console.log('❌ Something went wrong. MovieScout database not found.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('database "imdb_clone" is being accessed by other users')) {
            console.log('\n💡 Solution: Close all connections to imdb_clone database and try again.');
            console.log('   - Stop your backend server');
            console.log('   - Close any pgAdmin connections');
            console.log('   - Run this script again');
        }
    } finally {
        await client.end();
    }
}

// Run the function
renameDatabase().catch(console.error);