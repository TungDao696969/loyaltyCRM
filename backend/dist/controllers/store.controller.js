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
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreStore = exports.deleteStore = exports.updateStore = exports.getStoreById = exports.getStores = exports.createStore = void 0;
const store_service_1 = require("../services/store.service");
const storeService = new store_service_1.StoreService();
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield storeService.createStore(req.body);
        res
            .status(201)
            .json({ message: "Store created successfully", data: store });
    }
    catch (error) {
        res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
exports.createStore = createStore;
const getStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const is_deleted = req.query.is_deleted === 'true';
        const stores = yield storeService.getAllStores(is_deleted);
        res.status(200).json({ data: stores });
    }
    catch (error) {
        res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
exports.getStores = getStores;
const getStoreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const store = yield storeService.getStoreById(id);
        res.status(200).json({ data: store });
    }
    catch (error) {
        res.status(404).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
exports.getStoreById = getStoreById;
const updateStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedStore = yield storeService.updateStore(id, req.body);
        res
            .status(200)
            .json({ message: "Store updated successfully", data: updatedStore });
    }
    catch (error) {
        res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
exports.updateStore = updateStore;
const deleteStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield storeService.deleteStore(id);
        res.status(200).json({ message: "Store deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
exports.deleteStore = deleteStore;
const restoreStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield storeService.restoreStore(id);
        res.status(200).json({ message: "Store restored successfully" });
    }
    catch (error) {
        res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
});
exports.restoreStore = restoreStore;
