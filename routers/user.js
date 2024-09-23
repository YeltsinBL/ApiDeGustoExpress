import express from "express";
import { login, getItems, getItemById,createItem, deleteItemById } from "../controllers/user.js";

const routers = express.Router()

routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.post('/login', login)
routers.post('/', createItem)
routers.delete('/:id', deleteItemById)

export default routers