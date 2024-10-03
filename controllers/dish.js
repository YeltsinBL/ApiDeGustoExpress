import { getDishCategory } from "../models/dish.js"
import { httpError } from "../helpers/handleError.js"

export const getListDishCategory = async(req, res)=>{
    try {
        const listAll = await getDishCategory()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}