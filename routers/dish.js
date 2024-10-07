import express from 'express'
import { getListDishByBusiness, getListDishCategory, getListPopularDish } from '../controllers/dish.js'

const routers = express.Router()

routers.get('/dishCategory', getListDishCategory)
routers.get('/popular/:dishCategoryId', getListPopularDish)
routers.get('/business/:dishBusinessId', getListDishByBusiness)

export default routers