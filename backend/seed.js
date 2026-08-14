const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const existing = await prisma.rewardCatalog.count();
  if (existing === 0) {
    await prisma.rewardCatalog.create({
      data: {
        reward_name: 'Voucher Giảm 50K',
        required_points: 50,
        reward_type: 'VOUCHER',
        voucher_discount_value: 50000,
        is_active: true
      }
    });
    await prisma.rewardCatalog.create({
      data: {
        reward_name: 'Voucher Giảm 100K',
        required_points: 100,
        reward_type: 'VOUCHER',
        voucher_discount_value: 100000,
        is_active: true
      }
    });
    console.log('Seeded rewards');
  } else {
    console.log('Rewards already exist');
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
