import express from "express";
import { login, getItems, getItemById,createItem, deleteItemById, logout, validateSession, updateItem } from "../controllers/user.js";

const routers = express.Router()

routers.get('/', getItems)
routers.get('/validateSession', validateSession)
routers.get('/:id', getItemById)
routers.post('/login', login)
routers.post('/register', createItem)
routers.post('/logout', logout)
routers.put('/:id', updateItem)
routers.delete('/:id', deleteItemById)

export default routers