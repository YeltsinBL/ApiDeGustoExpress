import express from 'express'
import {getItems, getItemById, deleteItemById, createItem, updateItem, getItemsMobile, updateStates, getItemsStates} from '../controllers/business.js'

const routers = express.Router()

routers.get('/', getItems)
routers.get('/mobile', getItemsMobile)
routers.get('/states', getItemsStates)
routers.get('/:id', getItemById)
routers.delete('/:id', deleteItemById)
routers.post('/', createItem)
routers.put('/states', updateStates)
routers.put('/:id', updateItem)

export default routers