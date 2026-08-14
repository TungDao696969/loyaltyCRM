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
exports.tierRepository = exports.TierRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class TierRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customerTier.findMany({
                orderBy: { min_spent_amount: "asc" },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customerTier.findUnique({
                where: { tier_id: id },
            });
        });
    }
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customerTier.findUnique({
                where: { tier_code: code },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customerTier.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customerTier.update({
                where: { tier_id: id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customerTier.delete({
                where: { tier_id: id },
            });
        });
    }
}
exports.TierRepository = TierRepository;
exports.tierRepository = new TierRepository();
