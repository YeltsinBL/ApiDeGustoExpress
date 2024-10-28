import express from "express";
import { createItem, getItemsByUser } from "../controllers/sales.js"

const routers = express.Router()

routers.get('/:userId', getItemsByUser)
routers.post('/', createItem)

export default routers