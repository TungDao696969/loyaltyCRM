import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './prisma';
import { Prisma } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import storeRoutes from './routes/store.routes';
import customerRoutes from './routes/customer.routes';
import voucherRoutes from './routes/voucher.routes';
import tierRoutes from './routes/tier.routes';
import transactionRoutes from './routes/transaction.routes';
import segmentRoutes from './routes/segment.routes';
import campaignRoutes from './routes/campaign.routes';
import reportRoutes from './routes/report.routes';
import orderRoutes from './routes/order.routes';
// Khởi tạo worker
import './services/sms.worker';

// Fix BigInt JSON serialization error
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

(Prisma.Decimal.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bổ sung Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/tiers', tierRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running with Express and Prisma.');
});

// Example route using Prisma
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Attempting a simple query just to verify connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database connection failed', error);
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
