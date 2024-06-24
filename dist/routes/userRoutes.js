"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
// Middleware de JWT para ver si estamos autenticados
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: true, message: 'No Autorizado. Por favor iniciar sesion' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('error en la autenticacion: ', err);
            return res.status(403).json({ error: true, message: ' No tienes acceso a este recurso. Por favor iniciar sesion' });
        }
        next();
    });
};
router.post('/', authenticateToken, userController_1.createUser);
router.get('/', authenticateToken, userController_1.getAllUsers);
router.get('/:id', authenticateToken, userController_1.getUserById);
router.put('/:id', authenticateToken, userController_1.updateUser);
router.delete('/:id', authenticateToken, userController_1.deleteUser);
exports.default = router;
