import express from 'express'
import {getItems} from '../controllers/dish.js'

const routers = express.Router()

routers.get('/dishCategory', getItems)

export default routers