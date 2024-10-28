import express from 'express'
import { createItem, deleteItemById, getItemById, getListDishByBusiness, getListDishCategory, getListDishCategoryByBusinessId, getListPopularDish, updateItem } from '../controllers/dish.js'

const routers = express.Router()

routers.get('/dishCategory', getListDishCategory)
routers.get('/dishCategory/:businessId', getListDishCategoryByBusinessId)
routers.get('/popular/:dishCategoryId', getListPopularDish)
routers.get('/business/:dishBusinessId', getListDishByBusiness)
routers.get('/:id', getItemById)
routers.post('/', createItem)
routers.put('/', updateItem)
routers.delete('/:id', deleteItemById)

export default routers