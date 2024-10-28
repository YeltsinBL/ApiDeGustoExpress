import { httpError } from "../helpers/handleError.js"
import { create } from "../models/review.js"

export const createItem = async (req, res) => {
    try {
        const review = await create({ input: req.body })
        return res.status(review.codeStatus).json({message:review.message})
        
    } catch (e) {
        httpError(res,e)
    }

}