import { create, deleteById, getById, getDishByBusinessId, getDishCategory, getDishCategoryByBusiness, getPopularDish, update } from "../models/dish.js"
import { uploadSingleImageAsync } from "../middlewares/multer-config.js" 
import { saveImageCloudinary } from '../models/image.js'
import { httpError } from "../helpers/handleError.js"

export const getListDishCategory = async(req, res)=>{
    try {
        const listAll = await getDishCategory()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}
export const getListDishCategoryByBusinessId = async(req, res) =>{
    try {
        const {businessId} =req.params
        const result = await getDishCategoryByBusiness({businessId})
        if (result) return res.json(result)
        res.status(404).json({ message: 'Categorías de Platos no encontradas' })
    } catch (e) {
        httpError(res, e)
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

export const getItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await getById({id})
        if (result) return res.json(result)
        res.status(404).json({ message: 'Plato no encontrada' })
    } catch (e) {
        
    }
}

export const createItem = async (req, res) => {
    try {
        await uploadSingleImageAsync(req,res)
        if(req.file)
        {
          const datos = {filePath:req.file.path,bodyName:req.body.dishName+req.body.dish_BusinessId}
          const imgURLCloudinary = await saveImageCloudinary({  params: datos })
          if(imgURLCloudinary === false) return res.status(404).json({message:'No se pudo guardar la imagen.'})
          req.body.dishPhoto = imgURLCloudinary
        } else {
            req.body.dishPhoto = ''
            console.log("Plato sin foto");
        }
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
        if(req.file)
        {
          const datos = {filePath:req.file.path,bodyName:req.body.dishName+req.body.dish_BusinessId}
          const imgURLCloudinary = await saveImageCloudinary({  params: datos })
          if(imgURLCloudinary === false) return res.status(404).json({message:'No se pudo guardar la imagen.'})
          req.body.dishPhoto = imgURLCloudinary
        }

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
