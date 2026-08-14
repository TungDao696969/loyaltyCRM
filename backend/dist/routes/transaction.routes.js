"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protect routes
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.post("/", transaction_controller_1.createTransaction);
router.get("/", transaction_controller_1.getTransactions);
router.get("/:id", transaction_controller_1.getTransactionById);
router.put('/:id', transaction_controller_1.updateTransaction);
router.delete('/:id', transaction_controller_1.deleteTransaction);
exports.default = router;
