import { getAccount, getAll, getById, deleteById, create, upload } from "../models/user.js"
import { httpError } from "../helpers/handleError.js"
import jwt from 'jsonwebtoken'
export const login = async(req, res)=>{
    try {
        const user = await getAccount({ input: req.body })
        if(user.codeStatus) return res.status(user.codeStatus).json({message:user.message})
        
        // if(user.length==0) return res.status(400).json({message:"Usuario o contraseña incorrectos"})
        // const [{userStatus}] = user
        // if(userStatus == 2) return res.status(403).json({message:"Cuenta suspendida."})

        // Creación de un token
        const token = jwt.sign(
            {id:user.userId, username:user.userName, userStatus:user.userStatus, personEmail:user.personEmail}, // Datos del usuario
            process.env.SECRET_JWT_KEY, // Clave secreta
            { expiresIn:'1h' } // tiempo de expiración
        )

        res
        .cookie('access_token', token, {
            httpOnly: true, // la cookie solo se puede acceder en el servidor
            secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en producción
            sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
          })
        .send(user)
    } catch (e) {
        httpError(res,e)
    }
}
export const validateSession = async(req, res) => {
    try {
        const { user } = req.session
        if (!user) return res.status(403).send({ message:'Acceso no autorizado'})
        res.send(user)

    } catch (e) {
        httpError(res,e)
    }
}
export const getItems = async(req, res)=>{
    try {
        const { user } = req.session
        if (!user) return res.status(403).send({ message:'Acceso no autorizado'})
        const listAll = await getAll()
        res.send(listAll)

    } catch (e) {
        httpError(res,e)
    }
}

export const getItemById = async(req, res) => {
    try {
        const {id} = req.params
        const user = await getById({id})
        if (user) return res.json(user)
        res.status(404).json({ message: 'Usuario no encontrado' })
    } catch (e) {
        httpError(res,e)
    }
}
export const deleteItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await deleteById({id})
        if (result === false) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
          }
      
          return res.json({ message: 'Usuario eliminado' }) 
    } catch (e) {
        
    }
}
export const createItem = async (req, res) => {
    console.log(req.body)
    const user = await create({ input: req.body })
    if(user.codeStatus) return res.status(user.codeStatus).json({message:user.message})
    res.status(201).json(user)
}
export const logout = async (req, res) => {
    res.clearCookie('access_token')
    .json({ message: 'Sesión Cerrada' })
}

export const updateItem = async(req, res) =>{
    try {
        const {id} = req.params
        req.body.userId = id
        const result = await upload({input: req.body})
        if(result.codeStatus) return res.status(result.codeStatus).json({message:result.message})
        res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({message: error.message})
        // httpError(res,e)
    }
}