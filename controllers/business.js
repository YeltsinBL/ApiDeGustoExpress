import { httpError } from "../helpers/handleError.js"
import { getAll, getById,deleteById, create, upload } from '../models/business.js'
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
        const business = await getById({id})
        if (business) return res.json(business)
        res.status(404).json({ message: 'Negocio no encontrada' })
    } catch (e) {
        httpError(res,e)
    }
}
export const deleteItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await deleteById({id})
        if (result === false) {
            return res.status(404).json({ message: 'Negocio no encontrada' })
          }
      
          return res.json({ message: 'Negocio eliminada' }) 
    } catch (e) {
        
    }
}
export const createItem = async(req, res) =>{
    try {
        req.body.businessLogo = req.file.path
        const result = await create({ input: req.body })
        res.status(201).json(result)
    } catch (error) {
        httpError(res,e)
    }
}
export const updateItem = async(req, res) =>{
    try {
        const result = await upload({input: req.body})
        res.status(200).json(result)
    } catch (error) {
        httpError(res,e)
    }
}