import express from "express";
import { login, getItems, getItemById,createItem, deleteItemById, logout, validateSession } from "../controllers/user.js";

const routers = express.Router()

routers.get('/', getItems)
routers.get('/validateSession', validateSession)
routers.get('/:id', getItemById)
routers.post('/login', login)
routers.post('/register', createItem)
routers.post('/logout', logout)
routers.delete('/:id', deleteItemById)

export default routers