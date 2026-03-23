const pool = require('../config/database');

// Get all subscription plans
exports.getPlans = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscription_plans ORDER BY price');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create subscription (simplified without Stripe)
exports.createSubscription = async (req, res) => {
  const { plan_id, payment_method } = req.body;
  const userId = req.user.id;

  try {
    // Check if user already has active subscription
    const existing = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already have active subscription' });
    }

    // Get plan details
    const plan = await pool.query('SELECT * FROM subscription_plans WHERE id = $1', [plan_id]);
    if (plan.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const planData = plan.rows[0];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planData.duration_months);

    // Create subscription
    const subscription = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, end_date, stripe_customer_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, plan_id, 'active', endDate, `cus_demo_${userId}`]
    );

    // Create payment record
    await pool.query(
      `INSERT INTO payments (user_id, subscription_id, amount, status, payment_method, stripe_payment_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, subscription.rows[0].id, planData.price, 'completed', payment_method, `pi_demo_${Date.now()}`]
    );

    // Create invoice
    const invoiceNumber = `INV-${Date.now()}`;
    await pool.query(
      `INSERT INTO invoices (user_id, subscription_id, amount, invoice_number, paid_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
      [userId, subscription.rows[0].id, planData.price, invoiceNumber]
    );

    res.json({ 
      success: true, 
      subscription: subscription.rows[0],
      message: 'Subscription activated successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current subscription
exports.getCurrentSubscription = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT s.*, sp.name, sp.price, sp.features 
       FROM subscriptions s 
       JOIN subscription_plans sp ON s.plan_id = sp.id 
       WHERE s.user_id = $1 AND s.status = $2`,
      [userId, 'active']
    );

    if (result.rows.length === 0) {
      return res.json({ subscription: null });
    }

    res.json({ subscription: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE user_id = $2 AND status = $3 RETURNING *',
      ['cancelled', userId, 'active']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoices
exports.getInvoices = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pro contacts (for subscribed users)
exports.getProContacts = async (req, res) => {
  const { personId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user has active subscription
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Pro subscription required' });
    }

    const result = await pool.query(
      'SELECT * FROM pro_contacts WHERE person_id = $1',
      [personId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if user is Pro
exports.checkProStatus = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2 AND end_date > NOW()',
      [userId, 'active']
    );

    res.json({ isPro: result.rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
