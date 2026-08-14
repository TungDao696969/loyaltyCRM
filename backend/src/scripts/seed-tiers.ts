import prisma from '../prisma';

const tiers = [
  { tier_code: 'BRONZE', tier_name: 'Đồng', min_spent_amount: 0, point_multiplier: 1.0, description: 'Khách hàng mới' },
  { tier_code: 'SILVER', tier_name: 'Bạc', min_spent_amount: 10000000, point_multiplier: 1.2, description: 'Chi tiêu trên 10 triệu' },
  { tier_code: 'GOLD', tier_name: 'Vàng', min_spent_amount: 50000000, point_multiplier: 1.5, description: 'Chi tiêu trên 50 triệu' },
  { tier_code: 'PLATINUM', tier_name: 'Bạch Kim', min_spent_amount: 100000000, point_multiplier: 2.0, description: 'Chi tiêu trên 100 triệu' },
];

async function main() {
  console.log('Seeding Customer Tiers...');
  for (const t of tiers) {
    await prisma.customerTier.upsert({
      where: { tier_code: t.tier_code },
      update: {
        min_spent_amount: t.min_spent_amount,
        point_multiplier: t.point_multiplier,
      },
      create: t,
    });
    console.log(`Seeded ${t.tier_code}`);
  }
  console.log('Done seeding tiers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
