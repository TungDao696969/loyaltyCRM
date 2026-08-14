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
exports.StoreService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const store_repository_1 = require("../repositories/store.repository");
class StoreService {
    constructor() {
        this.storeRepository = new store_repository_1.StoreRepository();
    }
    createStore(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Kiểm tra trùng lặp mã cửa hàng
            const existingStore = yield this.storeRepository.findByCode(data.storeCode);
            if (existingStore) {
                throw new Error('Store code already exists');
            }
            // Tự động sinh apiKey bằng thư viện crypto có sẵn của Node.js
            const apiKey = crypto_1.default.randomUUID();
            return this.storeRepository.create(Object.assign(Object.assign({}, data), { apiKey, status: data.status || 'ACTIVE' }));
        });
    }
    getAllStores() {
        return __awaiter(this, arguments, void 0, function* (is_deleted = false) {
            return this.storeRepository.findAll(is_deleted);
        });
    }
    getStoreById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield this.storeRepository.findById(id);
            if (!store)
                throw new Error('Store not found');
            return store;
        });
    }
    updateStore(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Đảm bảo cửa hàng có tồn tại trước khi update
            yield this.getStoreById(id);
            return this.storeRepository.update(id, data);
        });
    }
    deleteStore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getStoreById(id);
            return this.storeRepository.delete(id);
        });
    }
    restoreStore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getStoreById(id);
            return this.storeRepository.restore(id);
        });
    }
}
exports.StoreService = StoreService;
