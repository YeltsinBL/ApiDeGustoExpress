import express from 'express'
import {getItems, getItemById, deleteItemById, createItem, updateItem, getItemsSearch, updateStates, getItemsStates, getItemsPopular} from '../controllers/business.js'

const routers = express.Router()

routers.get('/', getItems)
routers.get('/search', getItemsSearch)
routers.get('/popular', getItemsPopular)
routers.get('/states', getItemsStates)
routers.get('/:id', getItemById)
routers.delete('/:id', deleteItemById)
routers.post('/', createItem)
routers.put('/states', updateStates)
routers.put('/:id', updateItem)

export default routers