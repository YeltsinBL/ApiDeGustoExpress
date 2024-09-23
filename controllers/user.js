import { getAccount, getAll, getById, deleteById, create } from "../models/user.js"
import { httpError } from "../helpers/handleError.js"
export const login = async(req, res)=>{
    try {
        const user = await getAccount({ input: req.body })
        if(user.codeStatus) return res.status(user.codeStatus).json({message:user.message})
        
        // if(user.length==0) return res.status(400).json({message:"Usuario o contraseña incorrectos"})
        // const [{userStatus}] = user
        // if(userStatus == 2) return res.status(403).json({message:"Cuenta suspendida."})
        res.send(user)
    } catch (e) {
        httpError(res,e)
    }
}
export const getItems = async(req, res)=>{
    try {
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
    res.status(201).json(user)
}