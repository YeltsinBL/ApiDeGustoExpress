import { getDishCategory, getPopularDish } from "../models/dish.js"
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