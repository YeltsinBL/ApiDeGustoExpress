import express from 'express'
import { createItem, deleteItemById, getListDishByBusiness, getListDishCategory, getListPopularDish, updateItem } from '../controllers/dish.js'

const routers = express.Router()

routers.get('/dishCategory', getListDishCategory)
routers.get('/popular/:dishCategoryId', getListPopularDish)
routers.get('/business/:dishBusinessId', getListDishByBusiness)
routers.post('/', createItem)
routers.put('/', updateItem)
routers.delete('/:id', deleteItemById)

export default routers