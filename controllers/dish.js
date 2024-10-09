import { create, deleteById, getDishByBusinessId, getDishCategory, getPopularDish, update } from "../models/dish.js"
import { uploadSingleImageAsync } from "../middlewares/multer-config.js" 
import { httpError } from "../helpers/handleError.js"

export const getListDishCategory = async(req, res)=>{
    try {
        const listAll = await getDishCategory()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}

export const getListPopularDish = async(req, res) => {
    try {
        const {dishCategoryId} = req.params
        const list = await getPopularDish({dishCategoryId})
        return res.json(list)
    } catch (e) {
        httpError(res, e)
    }
}

export const getListDishByBusiness = async(req, res) => {
    try {
        const {dishBusinessId} = req.params
        const list = await getDishByBusinessId({dishBusinessId})
        return res.json(list)
    } catch (e) {
        httpError(res, e)
    }
}
export const createItem = async (req, res) => {
    try {
        // await uploadSingleImageAsync(req,res)
        // req.body.businessLogo = req.file.path
        const result = await create({ input: req.body })
        res.status(201).json(result)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
export const updateItem = async(req, res) =>{
    try {
        // Verificar imagen
        await uploadSingleImageAsync(req,res)

        // const {id} = req.params
        // req.body.businessId = id
        // if(req.file) req.body.businessLogo = req.file.path
        console.log(req.body)
        const result = await update({input: req.body})
        res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
export const deleteItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await deleteById({id})
        if (result === false) {
            return res.status(404).json({ message: 'Plato no encontrado' })
          }
      
          return res.json({ message: 'Plato eliminado' }) 
    } catch (e) {
        
    }
}
