
import { httpError } from "../helpers/handleError.js"
import { create, getSalesByUser } from "../models/sales.js"

export const createItem = async (req, res) => {
    try {
        const sales = await create({ input: req.body })
        return res.status(sales.codeStatus).json({message:sales.message})
        
    } catch (e) {
        httpError(res,e)
    }

}
export const getItemsByUser = async(req, res) =>{
    try {
        const result = await getSalesByUser({params: req.params})
        return res.json(result) 
    } catch (e) {
        
    }
}