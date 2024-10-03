import { getAll } from "../models/dish.js"
import { httpError } from "../helpers/handleError.js"

export const getItems = async(req, res)=>{
    try {
        const listAll = await getAll()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}