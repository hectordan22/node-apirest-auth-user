import { Request,Response } from "express"
import { hashPassword } from '../services/password.service'
import  prisma from '../models/user'

export const createUser = async (req:Request, res:Response): Promise <void> => {
    try {
        const { email, password, name} = req.body
        if (!email) {
            res.status(400).json({error:true, message:"El email es obligatorio"})
            return
         }
         if (!password){
            res.status(400).json({error:true, message:"El email ingresado ya existe"})
            return
         }

        const hashedPassword = await hashPassword(password)
        const body = {
            email,
            password:hashedPassword,
            nombre: name || 'user'
         }
     // registro el user en la BD
     const user = await prisma.create({
        data:body
     })

      res.status(201).json({ error:false, user })
    } catch (error:any) {
         // en caso de Postgresql detecte que se intenta registrar un email duplicado
     if (error?.code === 'P2002' && error?.meta?.target?.includes('email')){
        res.status(400).json({error:true, message:"El email ingresado ya existe"})
     } else{
       res.status(500).json({error:true, message:'Hubo un error pruebe mas tarde'})
     }
    }
}

export const getAllUsers = async (req:Request, res:Response) : Promise <void> => {
     try {
        const users = await prisma.findMany()
        res.status(200).json({error:false, users})
     } catch (error:any) {
        res.status(500).json({error:true, message:'Hubo un error pruebe mas tarde'})
     }
}

export const getUserById = async (req:Request, res:Response) : Promise <void> => {

    const userId = parseInt(req.params.id)  
    try {
       const user = await prisma.findUnique({
        where: {
            id: userId
        }
       })

       if (!user) {
          res.status(404).json({ error:true, message:'el usuario no fue encontrado'})
          return
       }

       res.status(200).json({error:false, user})
    } catch (error:any) {
       res.status(500).json({error:true, message:'Hubo un error pruebe mas tarde'})
    }
}

export const updateUser = async (req:Request, res:Response) : Promise <void> => {

    const userId = parseInt(req.params.id)  
    const { password, email, name }= req.body
    try {
        let dataToUpdate : any = {
            ...req.body
        }

        if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }

        if (email) {
            dataToUpdate.email = email
        }
       
        dataToUpdate.name = name ||'user'
         
        // actualizo en la base de datos
       const user = await prisma.update({
        where: {
            id: userId
        },
         data: dataToUpdate
       })

       res.status(200).json({error:false, user})
    } catch (error:any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({error:true, message:"El email ingresado ya existe"})
         } else if (error?.code === 'P2025'){
           res.status(404).json({error:true, message:'Usuario no encontrado'})
         }else{
             res.status(500).json({error:true, message:'Hubo un error pruebe mas tarde'})
         }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise <void> => {
    const userId = parseInt(req.params.id)  
   try {
      await prisma.delete({
        where:{
           id: userId
        }
      })

      res.status(200).json({
        error:false,
        message: `El usuario ${userId} ha sido eliminado`
      }).end()
   } catch (error:any) {
    if (error?.code === 'P2025'){
        res.status(404).json({error:true, message:'Usuario no encontrado'})
      }else{
          res.status(500).json({error:true, message:'Hubo un error pruebe mas tarde'})
      }
   }
}