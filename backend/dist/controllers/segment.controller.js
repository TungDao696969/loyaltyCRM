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
exports.getSegmentCustomers = exports.deleteSegment = exports.updateSegment = exports.createSegment = exports.getSegmentById = exports.getSegments = void 0;
const segment_service_1 = require("../services/segment.service");
const getSegments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const segments = yield segment_service_1.segmentService.getAllSegments();
        res.status(200).json({ data: segments });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getSegments = getSegments;
const getSegmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const segment = yield segment_service_1.segmentService.getSegmentById(req.params.id);
        res.status(200).json({ data: segment });
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getSegmentById = getSegmentById;
const createSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const segment = yield segment_service_1.segmentService.createSegment(req.body);
        res.status(201).json({ message: "Segment created", data: segment });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.createSegment = createSegment;
const updateSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const segment = yield segment_service_1.segmentService.updateSegment(req.params.id, req.body);
        res.status(200).json({ message: "Segment updated", data: segment });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.updateSegment = updateSegment;
const deleteSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield segment_service_1.segmentService.deleteSegment(req.params.id);
        res.status(200).json({ message: "Segment deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.deleteSegment = deleteSegment;
const getSegmentCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield segment_service_1.segmentService.getCustomersInSegment(req.params.id);
        // Xử lý serialize BigInt thủ công ở lớp controller nếu cần, nhưng express middleware đã lo việc đó rồi
        res.status(200).json({ data: customers, count: customers.length });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getSegmentCustomers = getSegmentCustomers;
