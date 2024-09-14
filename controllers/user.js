import { getAccount } from "../models/user.js"
import { httpError } from "../helpers/handleError.js"
export const login = async(req, res)=>{
    try {
        const user = await getAccount({ input: req.query })
        console.log(user.length)
        if(user.length==0) res.status(400).json({message:"Usuario o contraseña incorrectos"})
        res.send(user[0])
    } catch (e) {
        httpError(res,e)
    }
}