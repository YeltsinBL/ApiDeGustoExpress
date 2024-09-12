import {getAll, getById, deleteById, create} from '../models/customers.js'
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
        const customer = await getById({id})
        if (customer) return res.json(customer)
        res.status(404).json({ message: 'Cliente no encontrado' })
    } catch (e) {
        httpError(res,e)
    }
}
export const deleteItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await deleteById({id})
        if (result === false) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
          }
      
          return res.json({ message: 'Cliente eliminado' }) 
    } catch (e) {
        
    }
}
export const createItem = async (req, res) => {
    console.log(req.body)
    const newCustomer = await create({ input: req.body })
    res.status(201).json(newCustomer)
  }