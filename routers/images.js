import express from "express";
import { saveImage, viewImage} from "../controllers/images.js";

const routers = express.Router()

routers.post('/upload', saveImage);
routers.get('/:root/:name/:type/:image', viewImage);

export default routers