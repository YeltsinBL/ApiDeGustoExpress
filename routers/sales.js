import express from "express";
import { createItem, getItemsByBusiness, getItemsByUser } from "../controllers/sales.js"

const routers = express.Router()

routers.get('/:userId', getItemsByUser)
routers.get('/business/:businessId', getItemsByBusiness)
routers.post('/', createItem)

export default routers