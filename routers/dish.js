import express from 'express'
import { getListDishCategory } from '../controllers/dish.js'

const routers = express.Router()

routers.get('/dishCategory', getListDishCategory)

export default routers