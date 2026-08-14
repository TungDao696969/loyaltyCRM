import prisma from './src/prisma';
import { Prisma } from '@prisma/client';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
(Prisma.Decimal.prototype as any).toJSON = function () {
  return this.toString();
};

async function main() {
  const orders = await prisma.order.findMany({
    take: 1,
    include: { items: true, customer: true }
  });
  console.log(JSON.stringify(orders, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
