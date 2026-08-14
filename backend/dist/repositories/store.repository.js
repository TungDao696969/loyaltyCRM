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
exports.StoreRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class StoreRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.store.create({ data });
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (is_deleted = false) {
            return prisma_1.default.store.findMany({
                where: { is_deleted },
                orderBy: { createdAt: 'desc' },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.store.findUnique({
                where: { id },
            });
        });
    }
    findByCode(storeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.store.findUnique({
                where: { storeCode },
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.store.update({
                where: { id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.store.update({
                where: { id },
                data: { is_deleted: true },
            });
        });
    }
    restore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.store.update({
                where: { id },
                data: { is_deleted: false },
            });
        });
    }
}
exports.StoreRepository = StoreRepository;
