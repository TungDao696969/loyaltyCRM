import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
  getCustomerByPhone,
  addSpentAmount,
  getCustomerTransactions,
} from "../controllers/customer.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// Phân quyền cho ADMIN và SUPER_ADMIN đều xem và thao tác được với Customer
router.use(authenticateJWT, authorizeRole(["ADMIN", "SUPER_ADMIN"]));

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.put("/:id/restore", restoreCustomer);
router.post("/:id/add-spent", addSpentAmount);
router.get("/:id/transactions", getCustomerTransactions);

// tra cứu số điện thoại
router.get("/phone/:phone", getCustomerByPhone);

export default router;
