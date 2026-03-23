const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin...');

    // Add role column if not exists
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'
    `);
    console.log('✅ Role column added');

    // Update existing users to have 'user' role
    await db.query(`
      UPDATE users SET role = 'user' WHERE role IS NULL
    `);

    // Check if admin exists
    const existingAdmin = await db.query(
      "SELECT * FROM users WHERE email = 'admin@moviescout.com'"
    );

    if (existingAdmin.rows.length > 0) {
      // Update existing user to admin
      await db.query(
        "UPDATE users SET role = 'admin' WHERE email = 'admin@moviescout.com'"
      );
      console.log('✅ Existing user updated to admin');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
        ['admin', 'admin@moviescout.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created');
    }

    console.log('\n📧 Email: admin@moviescout.com');
    console.log('🔑 Password: admin123');
    console.log('🔗 Login: http://localhost:3000/admin/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
