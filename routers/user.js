import express from "express";
import { login, getItems, getItemById,createItem, deleteItemById } from "../controllers/user.js";

const routers = express.Router()

routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.post('/login', login)
routers.post('/register', createItem)
routers.delete('/:id', deleteItemById)

export default routers