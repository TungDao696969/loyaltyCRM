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
exports.customerService = exports.CustomerService = void 0;
const customer_repository_1 = require("../repositories/customer.repository");
class CustomerService {
    getAllCustomers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield customer_repository_1.customerRepository.findAll(filters);
        });
    }
    getCustomerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield customer_repository_1.customerRepository.findById(BigInt(id));
            if (!customer) {
                throw new Error("Customer not found");
            }
            return customer;
        });
    }
    createCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate phone unique
            const existing = yield customer_repository_1.customerRepository.findByPhone(data.phone_number);
            if (existing) {
                throw new Error("Phone number already exists");
            }
            const customerInput = {
                phone_number: data.phone_number,
                full_name: data.full_name,
                email: data.email,
                gender: data.gender,
                date_of_birth: data.date_of_birth
                    ? new Date(data.date_of_birth)
                    : undefined,
                status: data.status || "ACTIVE",
            };
            return yield customer_repository_1.customerRepository.create(customerInput);
        });
    }
    updateCustomer(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield customer_repository_1.customerRepository.findById(BigInt(id));
            if (!customer) {
                throw new Error("Customer not found");
            }
            if (data.phone_number && data.phone_number !== customer.phone_number) {
                const existing = yield customer_repository_1.customerRepository.findByPhone(data.phone_number);
                if (existing) {
                    throw new Error("Phone number already exists");
                }
            }
            const updateInput = {
                phone_number: data.phone_number,
                full_name: data.full_name,
                email: data.email,
                gender: data.gender,
                date_of_birth: data.date_of_birth
                    ? new Date(data.date_of_birth)
                    : undefined,
                status: data.status,
            };
            return yield customer_repository_1.customerRepository.update(BigInt(id), updateInput);
        });
    }
    deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = BigInt(id);
            yield this.getCustomerById(id);
            return yield customer_repository_1.customerRepository.delete(customerId);
        });
    }
    restoreCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = BigInt(id);
            yield this.getCustomerById(id);
            return yield customer_repository_1.customerRepository.restore(customerId);
        });
    }
    getCustomerByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield customer_repository_1.customerRepository.findByPhone(phone);
        });
    }
}
exports.CustomerService = CustomerService;
exports.customerService = new CustomerService();
