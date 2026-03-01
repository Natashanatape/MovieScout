const db = require('../config/database');

const seedPlans = async () => {
  try {
    // Insert subscription plans
    const plans = [
      {
        name: 'Monthly Pro',
        price: 9.99,
        duration_months: 1,
        features: JSON.stringify({
          pro_badge: true,
          contact_access: true,
          analytics: true,
          priority_support: true
        })
      },
      {
        name: 'Yearly Pro',
        price: 99.99,
        duration_months: 12,
        features: JSON.stringify({
          pro_badge: true,
          contact_access: true,
          analytics: true,
          priority_support: true,
          discount: '17% off'
        })
      }
    ];

    for (const plan of plans) {
      await db.query(
        `INSERT INTO subscription_plans (name, price, duration_months, features) 
         VALUES ($1, $2, $3, $4)`,
        [plan.name, plan.price, plan.duration_months, plan.features]
      );
    }

    console.log('✅ Subscription plans seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
    throw error;
  }
};

if (require.main === module) {
  seedPlans()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedPlans;