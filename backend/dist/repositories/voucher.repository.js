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
exports.voucherRepository = exports.VoucherRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class VoucherRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.voucher.findMany({
                orderBy: { expired_at: "desc" },
                include: {
                    customer: true // Include customer details if assigned
                }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.voucher.findUnique({
                where: { voucher_id: id },
                include: {
                    customer: true
                }
            });
        });
    }
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.voucher.findUnique({
                where: { voucher_code: code },
                include: {
                    customer: true
                }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.voucher.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.voucher.update({
                where: { voucher_id: id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.voucher.delete({
                where: { voucher_id: id },
            });
        });
    }
}
exports.VoucherRepository = VoucherRepository;
exports.voucherRepository = new VoucherRepository();
