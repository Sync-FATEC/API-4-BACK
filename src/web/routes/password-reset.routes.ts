import { Router } from 'express';
import { PasswordResetController } from '../controllers/auth/PasswordResetController';
import { limiter } from '../../infrastructure/middlewares/limiter';
import { asyncHandler } from '../middlewares/asyncHandler';

const passwordResetRoutes = Router();
const passwordResetController = new PasswordResetController();

/**
 * @swagger
 * /password-reset/request:
 *   post:
 *     summary: Solicita redefinição de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Solicitação processada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 */
passwordResetRoutes.post(
  '/request', 
  limiter, 
  asyncHandler((req, res, next) => passwordResetController.requestReset(req, res, next))
);

/**
 * @swagger
 * /password-reset/reset/{token}:
 *   post:
 *     summary: Redefine a senha utilizando token
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Dados inválidos ou token expirado
 */
passwordResetRoutes.post(
  '/reset/:token', 
  limiter, 
  asyncHandler((req, res, next) => passwordResetController.resetPassword(req, res, next))
);

export { passwordResetRoutes };