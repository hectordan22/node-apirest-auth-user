import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
const app = express()

/**
 * Configuramos los cors que sean para todo el mundo
 */
app.use(cors())
app.use(express.json())

//Routes
// autenticacion
app.use('/auth', authRoutes)
//user 
app.use('/users', userRoutes)

console.log('esto esta siendo ejecutadoo')

export default app