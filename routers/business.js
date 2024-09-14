import express from 'express'
import {getItems, getItemById, deleteItemById, createItem, updateItem} from '../controllers/business.js'

const routers = express.Router()

routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.delete('/:id', deleteItemById)
routers.post('/', createItem)
routers.put('/:id', updateItem)

export default routers