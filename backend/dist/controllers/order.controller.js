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
exports.createOrder = exports.getAllOrders = exports.getCustomerOrders = void 0;
const order_service_1 = require("../services/order.service");
// Hàm tiện ích convert BigInt sang String để API trả về không bị lỗi
const convertBigIntToString = (obj) => {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === "bigint")
        return obj.toString();
    if (Array.isArray(obj))
        return obj.map(convertBigIntToString);
    if (typeof obj === "object") {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, convertBigIntToString(v)]));
    }
    return obj;
};
const getCustomerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.orderService.getCustomerOrders(req.params.id);
        res.status(200).json({ data: convertBigIntToString(orders) });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getCustomerOrders = getCustomerOrders;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.orderService.getAllOrders();
        res.status(200).json({ data: convertBigIntToString(orders) });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getAllOrders = getAllOrders;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_service_1.orderService.createOrder(req.body);
        res.status(201).json({
            message: "Order created successfully",
            data: convertBigIntToString(order),
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.createOrder = createOrder;
