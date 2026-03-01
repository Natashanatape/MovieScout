const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.query(
      "SELECT * FROM users WHERE email = 'admin@moviescout.com'"
    );

    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists');
      
      // Update to admin role if not already
      await db.query(
        "UPDATE users SET role = 'admin' WHERE email = 'admin@moviescout.com'"
      );
      console.log('✅ Admin role updated');
      process.exit(0);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4)`,
      ['admin', 'admin@moviescout.com', hashedPassword, 'admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@moviescout.com');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
