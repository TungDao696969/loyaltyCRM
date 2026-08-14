import 'dotenv/config';
import prisma from './src/prisma';

async function test() {
  try {
    const stores = await prisma.store.findMany({
      where: { is_deleted: false },
    });
    console.log("Stores count:", stores.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    process.exit(0);
  }
}
test();
