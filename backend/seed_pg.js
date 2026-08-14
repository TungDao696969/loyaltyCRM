require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    const res = await pool.query('SELECT count(*) FROM reward_catalogs');
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO reward_catalogs (reward_name, required_points, reward_type, voucher_discount_value, is_active, created_at, updated_at)
        VALUES 
        ('Voucher Giảm 50K', 50, 'VOUCHER', 50000, true, NOW(), NOW()),
        ('Voucher Giảm 100K', 100, 'VOUCHER', 100000, true, NOW(), NOW()),
        ('Quà tặng: Ly sứ', 200, 'GIFT', NULL, true, NOW(), NOW())
      `);
      console.log('Seeded rewards successfully!');
    } else {
      console.log('Rewards already exist.');
    }
  } catch (err) {
    console.error('Error seeding rewards', err);
  } finally {
    await pool.end();
  }
}

seed();
