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
exports.getCustomerTransactions = exports.addSpentAmount = exports.getCustomerByPhone = exports.restoreCustomer = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const customer_service_1 = require("../services/customer.service");
const transaction_service_1 = require("../services/transaction.service");
const tier_service_1 = require("../services/tier.service");
const prisma_1 = __importDefault(require("../prisma"));
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Thu thập tất cả query params
        const filters = {
            is_deleted: req.query.is_deleted === "true",
            email: req.query.email,
            customer_id: req.query.customer_id,
            full_name: req.query.full_name,
            status: req.query.status,
            segment_id: req.query.segment_id // Nếu muốn lọc theo phân loại
        };
        // Truyền object filter xuống service 
        const customers = yield customer_service_1.customerService.getAllCustomers(filters);
        res.status(200).json({ data: customers });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getCustomers = getCustomers;
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_service_1.customerService.getCustomerById(req.params.id);
        res.status(200).json({ data: customer });
    }
    catch (error) {
        if ((error instanceof Error ? error.message : String(error)) ===
            "Customer not found") {
            res.status(404).json({
                message: error instanceof Error ? error.message : String(error),
            });
            return;
        }
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getCustomerById = getCustomerById;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_service_1.customerService.createCustomer(req.body);
        res.status(201).json({ message: "Customer created", data: customer });
    }
    catch (error) {
        if ((error instanceof Error ? error.message : String(error)) ===
            "Phone number already exists") {
            res.status(400).json({
                message: error instanceof Error ? error.message : String(error),
            });
            return;
        }
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.createCustomer = createCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_service_1.customerService.updateCustomer(req.params.id, req.body);
        res.status(200).json({ message: "Customer updated", data: customer });
    }
    catch (error) {
        if ((error instanceof Error ? error.message : String(error)) ===
            "Customer not found") {
            res.status(404).json({
                message: error instanceof Error ? error.message : String(error),
            });
            return;
        }
        if ((error instanceof Error ? error.message : String(error)) ===
            "Phone number already exists") {
            res.status(400).json({
                message: error instanceof Error ? error.message : String(error),
            });
            return;
        }
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield customer_service_1.customerService.deleteCustomer(req.params.id);
        res.status(200).json({ message: "Customer deleted successfully" });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.deleteCustomer = deleteCustomer;
const restoreCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield customer_service_1.customerService.restoreCustomer(req.params.id);
        res.status(200).json({ message: "Customer restored successfully" });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.restoreCustomer = restoreCustomer;
const getCustomerByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.params;
        const customer = yield customer_service_1.customerService.getCustomerByPhone(phone);
        if (!customer) {
            res.status(404).json({
                message: "Customer not found",
            });
            return;
        }
        res.status(200).json({
            data: customer,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getCustomerByPhone = getCustomerByPhone;
const addSpentAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        if (!amount || typeof amount !== "number") {
            res.status(400).json({ message: "Invalid amount" });
            return;
        }
        // Tăng total_spent (Demo only, in real app it's calculated from transactions)
        const customer = yield prisma_1.default.customer.findUnique({
            where: { customer_id: BigInt(id) },
        });
        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        const newSpent = Number(customer.total_spent) + amount;
        yield prisma_1.default.customer.update({
            where: { customer_id: BigInt(id) },
            data: { total_spent: newSpent },
        });
        // Auto update tier
        const updatedCustomer = yield tier_service_1.tierService.evaluateCustomerTier(id);
        // Ensure BigInt is serialized correctly via our normal routes or manual conversion if needed
        // The default JSON.stringify will fail on BigInt unless handled by Prisma/Express setup.
        // Assuming backend already handles BigInt.
        res.status(200).json({
            message: "Spent amount added and tier evaluated",
            data: Object.assign(Object.assign({}, updatedCustomer), { customer_id: updatedCustomer.customer_id.toString() }),
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.addSpentAmount = addSpentAmount;
const getCustomerTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_service_1.transactionService.getTransactionsByCustomerId(req.params.id);
        res.status(200).json({ data: transactions });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getCustomerTransactions = getCustomerTransactions;
