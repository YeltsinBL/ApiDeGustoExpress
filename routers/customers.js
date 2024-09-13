import express from 'express'
import {getItems, getItemById, createItem, deleteItemById} from '../controllers/customers.js'
const routers = express.Router()

routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.post('/', createItem)
routers.delete('/:id', deleteItemById)


export default routers