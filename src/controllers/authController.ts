import { Request,Response } from "express"
import { comparePasswords, hashPassword } from '../services/password.service'
import  prisma from '../models/user'
import { generateToken } from "../services/auth.services"


export const register = async (req: Request,res: Response): Promise<void> => {
   const { email, password} = req.body
   try {
      if (!email) {
         res.status(400).json({message:"El email es obligatorio"})
         return
      }
      if (!password){
         res.status(400).json({message:"El email ingresado ya existe"})
         return
      }

     const hashedPassword = await hashPassword(password)
     // registro el user en la BD
     const user = await prisma.create({
        data:{
           email,
           password:hashedPassword
        }
     })

     // creo token para el usuario
     const token = generateToken(user)
     res.status(201).json({token})
   } catch (error:any) {
      console.log(error)
      // en caso de Postgresql detecte que se intenta registrar un email duplicado
     if (error?.code === 'P2002' && error?.meta?.target?.includes('email')){
        res.status(400).json({message:"El email ingresado ya existe"})
     } else{
       res.status(500).json({error:'Hubo un error en el registro'})
     }
 
   }
}


export const login = async (req:Request, res:Response): Promise<void> => {

   const { email, password } = req.body
   try {

      if (!email) {
         res.status(400).json({message:"El email es obligatorio"})
         return
      }
      if (!password){
         res.status(400).json({message:"El email ingresado ya existe"})
         return
      }
      
      const user = await prisma.findUnique({ where: { email } })
      console.log(user)

      if (!user) {
         console.log(user)
         res.status(404).json({error:'El usuario y la contraseña no coinciden'})
         return

      }

      // verifico la coincidencia de la contraseña de la base de datos con la que ingresa el usuario 
      console.log([
         {
            name:'del usuario',
            type: typeof password
         },
         {
            name:'de la bd',
            type: typeof user.password
         }
      ])
      const passwordMatch = await comparePasswords(password,user.password)
      if (!passwordMatch) {
          res.status(401).json({error:'Usuario y contraseña no coinciden'})
          return
      }

      const token = generateToken(user)
      res.status(200).json({token})
   } catch (error) {
      console.log(`Error catch: ${error}`)
   }
}

