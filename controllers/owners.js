import {getAll, getById, deleteById, create} from '../models/owners.js'
export const getItems = async(req, res)=>{
    try {
        const listAll = await getAll()
        res.send(listAll)

    } catch (e) {
        httpError(res,e)
    }
}

export const getItemById = async(req, res) => {
    try {
        const {id} = req.params
        const business = await getById({id})
        if (business) return res.json(business)
        res.status(404).json({ message: 'Propietario no encontrado' })
    } catch (e) {
        httpError(res,e)
    }
}
export const deleteItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await deleteById({id})
        if (result === false) {
            return res.status(404).json({ message: 'Propietario no encontrado' })
          }
      
          return res.json({ message: 'Propietario eliminado' }) 
    } catch (e) {
        
    }
}
export const createItem = async (req, res) => {
    console.log(req.body)
    const newMovie = await create({ input: req.body })
    res.status(201).json(newMovie)
  }