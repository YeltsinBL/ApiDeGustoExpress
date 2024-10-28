import express from "express";
import { createItem } from "../controllers/sales.js";

const routers = express.Router()

routers.post('/', createItem)

export default routers