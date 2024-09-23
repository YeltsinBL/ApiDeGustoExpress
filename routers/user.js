import express from "express";
import { login, getItems, getItemById,createItem, deleteItemById } from "../controllers/user.js";

const routers = express.Router()

routers.get('/login', login)
routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.post('/', createItem)
routers.delete('/:id', deleteItemById)

export default routers