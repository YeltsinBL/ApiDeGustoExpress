import express from 'express'
import {getItems} from '../controllers/businessareas.js'

const routers = express.Router()

routers.get('/', getItems)

export default routers