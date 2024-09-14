import express from "express";
import { login } from "../controllers/user.js";

const routers = express.Router()

routers.get('/login', login)

export default routers