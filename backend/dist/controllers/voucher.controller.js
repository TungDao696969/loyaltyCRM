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
exports.checkVoucher = exports.applyVoucher = exports.deleteVoucher = exports.updateVoucher = exports.getRewards = exports.exchangeVoucher = exports.createVoucher = exports.getVoucherById = exports.getVouchers = void 0;
const voucher_service_1 = require("../services/voucher.service");
const getVouchers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vouchers = yield voucher_service_1.voucherService.getAllVouchers();
        res.status(200).json({ data: vouchers });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getVouchers = getVouchers;
const getVoucherById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voucher = yield voucher_service_1.voucherService.getVoucherById(req.params.id);
        res.status(200).json({ data: voucher });
    }
    catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getVoucherById = getVoucherById;
const createVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voucher = yield voucher_service_1.voucherService.createVoucher(req.body);
        res.status(201).json({ message: "Voucher created", data: voucher });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.createVoucher = createVoucher;
const exchangeVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, reward_id } = req.body;
        if (!customer_id || !reward_id) {
            res.status(400).json({ message: "customer_id and reward_id are required" });
            return;
        }
        const voucher = yield voucher_service_1.voucherService.exchangePointsForVoucher(customer_id, String(reward_id));
        res.status(200).json({ message: "Voucher generated from points", data: voucher });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.exchangeVoucher = exchangeVoucher;
const prisma_1 = __importDefault(require("../prisma"));
const getRewards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewards = yield prisma_1.default.rewardCatalog.findMany({
            where: { is_active: true }
        });
        res.status(200).json({ data: rewards });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getRewards = getRewards;
const updateVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voucher = yield voucher_service_1.voucherService.updateVoucher(req.params.id, req.body);
        res.status(200).json({ message: "Voucher updated", data: voucher });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.updateVoucher = updateVoucher;
const deleteVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield voucher_service_1.voucherService.deleteVoucher(req.params.id);
        res.status(200).json({ message: "Voucher deleted successfully" });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.deleteVoucher = deleteVoucher;
const applyVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { voucher_code, customer_id } = req.body;
        if (!voucher_code) {
            res.status(400).json({ message: "Voucher code is required" });
            return;
        }
        const voucher = yield voucher_service_1.voucherService.applyVoucher(voucher_code, customer_id);
        res
            .status(200)
            .json({ message: "Voucher applied successfully", data: voucher });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.applyVoucher = applyVoucher;
const checkVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { voucher_code, customer_id, order_amount } = req.body;
        if (!voucher_code) {
            res.status(400).json({ message: "Voucher code is required" });
            return;
        }
        const voucher = yield voucher_service_1.voucherService.checkVoucher(voucher_code, customer_id, order_amount ? Number(order_amount) : undefined);
        res
            .status(200)
            .json({ message: "Voucher is valid", data: voucher });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.checkVoucher = checkVoucher;
