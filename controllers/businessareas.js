import { httpError } from "../helpers/handleError.js"
import {getAll} from '../models/businessareas.js'
export const getItems = async(req, res)=>{
    try {
        const listAll = await getAll()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}
