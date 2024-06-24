import express, { NextFunction, Request, Response} from 'express'
import { createUser, getAllUsers, getUserById, updateUser, deleteUser} from '../controllers/userController'
import jwt from 'jsonwebtoken'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

// Middleware de JWT para ver si estamos autenticados

const authenticateToken = (req:Request, res: Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({error:true, message:'No Autorizado. Por favor iniciar sesion'})
    }

    jwt.verify(token, JWT_SECRET, (err,decoded) => {
        if (err) {
            console.error('error en la autenticacion: ', err)
            return res.status(403).json({error:true, message:'No tienes acceso a este recurso. Por favor iniciar sesion'})
        }

        next();
    })
}

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers )
router.get('/:id', authenticateToken,getUserById )
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)

export default router