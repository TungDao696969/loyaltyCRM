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
exports.transactionRepository = exports.TransactionRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class TransactionRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.pointTransaction.findMany({
                orderBy: { created_at: "desc" },
                include: {
                    customer: true,
                    store: true
                }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.pointTransaction.findUnique({
                where: { transaction_id: id },
                include: {
                    customer: true,
                    store: true
                }
            });
        });
    }
    findByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.pointTransaction.findMany({
                where: { customer_id: customerId },
                orderBy: { created_at: "desc" },
                include: {
                    store: true,
                    customer: false
                }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.pointTransaction.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.pointTransaction.update({
                where: { transaction_id: id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.pointTransaction.delete({
                where: { transaction_id: id },
            });
        });
    }
}
exports.TransactionRepository = TransactionRepository;
exports.transactionRepository = new TransactionRepository();
