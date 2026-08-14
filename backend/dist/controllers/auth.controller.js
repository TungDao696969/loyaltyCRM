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
exports.refreshToken = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }
        const admin = yield prisma_1.default.admin.findUnique({
            where: { username },
        });
        if (!admin) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const payload = {
            id: admin.id,
            username: admin.username,
            role: admin.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1d'),
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
        });
        yield prisma_1.default.admin.update({
            where: { id: admin.id },
            data: { refreshToken },
        });
        res.status(200).json({
            message: 'Login successful',
            token,
            refreshToken,
            user: payload,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch (err) {
            res.status(401).json({ message: 'Invalid or expired refresh token' });
            return;
        }
        const admin = yield prisma_1.default.admin.findUnique({
            where: { id: decoded.id },
        });
        if (!admin || admin.refreshToken !== refreshToken) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }
        const payload = {
            id: admin.id,
            username: admin.username,
            role: admin.role,
        };
        const newToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1d'),
        });
        const newRefreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
        });
        yield prisma_1.default.admin.update({
            where: { id: admin.id },
            data: { refreshToken: newRefreshToken },
        });
        res.status(200).json({
            message: 'Token refreshed successfully',
            token: newToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.refreshToken = refreshToken;
