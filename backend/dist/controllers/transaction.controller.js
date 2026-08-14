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
exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactionById = exports.getTransactions = void 0;
const transaction_service_1 = require("../services/transaction.service");
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_service_1.transactionService.getAllTransactions();
        res.status(200).json({ data: transactions });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getTransactions = getTransactions;
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_service_1.transactionService.getTransactionById(req.params.id);
        res.status(200).json({ data: transaction });
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getTransactionById = getTransactionById;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_service_1.transactionService.createTransaction(req.body);
        res.status(201).json({ message: "Transaction created", data: transaction });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.createTransaction = createTransaction;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_service_1.transactionService.updateTransaction(req.params.id, req.body);
        res.status(200).json({ message: "Transaction updated", data: transaction });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transaction_service_1.transactionService.deleteTransaction(req.params.id);
        res.status(200).json({ message: "Transaction deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.deleteTransaction = deleteTransaction;
