import express from 'express'
import { getListDishCategory, getListPopularDish } from '../controllers/dish.js'

const routers = express.Router()

routers.get('/dishCategory', getListDishCategory)
routers.get('/popular/:dishCategoryId', getListPopularDish)

export default routers