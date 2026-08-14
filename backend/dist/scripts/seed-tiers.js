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
const prisma_1 = __importDefault(require("../prisma"));
const tiers = [
    { tier_code: 'BRONZE', tier_name: 'Đồng', min_spent_amount: 0, point_multiplier: 1.0, description: 'Khách hàng mới' },
    { tier_code: 'SILVER', tier_name: 'Bạc', min_spent_amount: 10000000, point_multiplier: 1.2, description: 'Chi tiêu trên 10 triệu' },
    { tier_code: 'GOLD', tier_name: 'Vàng', min_spent_amount: 50000000, point_multiplier: 1.5, description: 'Chi tiêu trên 50 triệu' },
    { tier_code: 'PLATINUM', tier_name: 'Bạch Kim', min_spent_amount: 100000000, point_multiplier: 2.0, description: 'Chi tiêu trên 100 triệu' },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding Customer Tiers...');
        for (const t of tiers) {
            yield prisma_1.default.customerTier.upsert({
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
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}));
