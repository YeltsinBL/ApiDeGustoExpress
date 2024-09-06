import { httpError } from "../helpers/handleError.js"
import { getAll, getById,deleteById } from '../models/business.js'
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