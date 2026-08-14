"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = __importDefault(require("./prisma"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const store_routes_1 = __importDefault(require("./routes/store.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const voucher_routes_1 = __importDefault(require("./routes/voucher.routes"));
const tier_routes_1 = __importDefault(require("./routes/tier.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const segment_routes_1 = __importDefault(require("./routes/segment.routes"));
const campaign_routes_1 = __importDefault(require("./routes/campaign.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
// Khởi tạo worker
require("./services/sms.worker");
// Fix BigInt JSON serialization error
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Bổ sung Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/stores', store_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/vouchers', voucher_routes_1.default);
app.use('/api/tiers', tier_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/segments', segment_routes_1.default);
app.use('/api/campaigns', campaign_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.get('/', (req, res) => {
    res.send('Backend server is running with Express and Prisma.');
});
// Example route using Prisma
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempting a simple query just to verify connection
        yield prisma_1.default.$queryRaw `SELECT 1`;
        res.status(200).json({ status: 'ok', database: 'connected' });
    }
    catch (error) {
        console.error('Database connection failed', error);
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
