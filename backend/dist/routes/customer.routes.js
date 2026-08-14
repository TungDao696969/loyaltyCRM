"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Phân quyền cho ADMIN và SUPER_ADMIN đều xem và thao tác được với Customer
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.post("/", customer_controller_1.createCustomer);
router.get("/", customer_controller_1.getCustomers);
router.get("/:id", customer_controller_1.getCustomerById);
router.put("/:id", customer_controller_1.updateCustomer);
router.delete("/:id", customer_controller_1.deleteCustomer);
router.put("/:id/restore", customer_controller_1.restoreCustomer);
router.post("/:id/add-spent", customer_controller_1.addSpentAmount);
router.get("/:id/transactions", customer_controller_1.getCustomerTransactions);
// tra cứu số điện thoại
router.get("/phone/:phone", customer_controller_1.getCustomerByPhone);
exports.default = router;
