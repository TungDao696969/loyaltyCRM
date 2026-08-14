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
exports.deleteTier = exports.updateTier = exports.createTier = exports.getTierById = exports.getTiers = void 0;
const tier_service_1 = require("../services/tier.service");
const getTiers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tiers = yield tier_service_1.tierService.getAllTiers();
        res.status(200).json({ data: tiers });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getTiers = getTiers;
const getTierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tier = yield tier_service_1.tierService.getTierById(req.params.id);
        res.status(200).json({ data: tier });
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getTierById = getTierById;
const createTier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tier = yield tier_service_1.tierService.createTier(req.body);
        res.status(201).json({ message: "Tier created", data: tier });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.createTier = createTier;
const updateTier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tier = yield tier_service_1.tierService.updateTier(req.params.id, req.body);
        res.status(200).json({ message: "Tier updated", data: tier });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.updateTier = updateTier;
const deleteTier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tier_service_1.tierService.deleteTier(req.params.id);
        res.status(200).json({ message: "Tier deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.deleteTier = deleteTier;
