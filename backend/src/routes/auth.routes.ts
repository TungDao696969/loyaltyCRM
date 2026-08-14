import { Router } from 'express';
import { login, refreshToken } from '../controllers/auth.controller';
import { authenticateJWT, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint đăng nhập
router.post('/login', login);

// Endpoint refresh token
router.post('/refresh-token', refreshToken);

// Endpoint kiểm tra token (vd: lấy profile user)
router.get('/me', authenticateJWT, (req, res) => {
  res.json({
    message: 'Profile retrieved successfully',
    user: req.user,
  });
});

// Endpoint ví dụ chỉ dành cho SUPER_ADMIN
router.get('/admin-only', authenticateJWT, authorizeRole(['SUPER_ADMIN']), (req, res) => {
  res.json({ message: 'Welcome Super Admin' });
});

export default router;
