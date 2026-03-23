const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  // Connect without database to create it
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    
    // Create database
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`ℹ️  Database '${process.env.DB_NAME}' already exists`);
    } else {
      console.error('❌ Error creating database:', error.message);
    }
  } finally {
    await client.end();
  }
}

setupDatabase();
