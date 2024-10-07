import { create, getDishByBusinessId, getDishCategory, getPopularDish } from "../models/dish.js"
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