import { Request,Response } from "express"
import { comparePasswords, hashPassword } from '../services/password.service'
import  prisma from '../models/user'
import { generateToken } from "../services/auth.services"


export const register = async (req: Request,res: Response): Promise<void> => {
   const { email, password, name } = req.body
   try {
      if (!email) {
         res.status(400).json({error:true, message:"El email es obligatorio"})
         return
      }
      if (!password){
         res.status(400).json({ error: true, message:"El email ingresado ya existe"})
         return
      }
      
     const hashedPassword = await hashPassword(password)
     // registro el user en la BD
     const body = {
      email,
      password:hashedPassword,
      nombre: name || 'user'
     }
     const user = await prisma.create({
        data:body
     })

     // creo token para el usuario
     const token = generateToken(user)
     res.status(201).json({error:false, token})
   } catch (error:any) {
      console.log(error)
      // en caso de Postgresql detecte que se intenta registrar un email duplicado
     if (error?.code === 'P2002' && error?.meta?.target?.includes('email')){
        res.status(400).json({error:true, message:"El email ingresado ya existe"})
     } else{
       res.status(500).json({error:true, message:'Hubo un error en el registro'})
     }
 
   }
}


export const login = async (req:Request, res:Response): Promise<void> => {

   const { email, password } = req.body
   try {

      if (!email) {
         res.status(400).json({error:true, message:"El email es obligatorio"})
         return
      }
      if (!password){
         res.status(400).json({error:true, message:"El email ingresado ya existe"})
         return
      }
      
      const user = await prisma.findUnique({ where: { email } })
      console.log(user)

      if (!user) {
         console.log(user)
         res.status(404).json({error:true, message:'El usuario y la contraseña no coinciden'})
         return

      }

   
      const passwordMatch = await comparePasswords(password,user.password)
      if (!passwordMatch) {
          res.status(401).json({error:true, message:'Usuario y contraseña no coinciden'})
          return
      }

      const token = generateToken(user)
      res.status(200).json({error:false, token})
   } catch (error) {
      res.status(500).json({error:true, message:`Error catch: ${error}`})
      
   }
}

