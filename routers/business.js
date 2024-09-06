import express from 'express'
import {getItems, getItemById, deleteItemById} from '../controllers/business.js'

const routers = express.Router()

routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.delete('/:id', deleteItemById)

export default routers