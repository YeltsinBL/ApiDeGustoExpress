
import { httpError } from "../helpers/handleError.js"
import { create } from "../models/sales.js"

export const createItem = async (req, res) => {
    try {
        const sales = await create({ input: req.body })
        return res.status(sales.codeStatus).json({message:sales.message})
        
    } catch (e) {
        httpError(res,e)
    }

}