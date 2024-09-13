import express from 'express'
import multer from "multer";
import fs from 'fs'
import { directoryPath } from '../utils.js'
import {getItems, getItemById, deleteItemById, createItem, updateItem} from '../controllers/business.js'

const routers = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!file) return
        const dir = './images'.concat(`/${req.body.businessName.replace(/\s/g,'')}`, '/logo');
        const storeFolder = directoryPath.concat(dir.substring(2))
        if (!fs.existsSync(storeFolder)) {
            fs.mkdirSync(storeFolder, { recursive: true });
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        if(!file) return
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })
routers.get('/', getItems)
routers.get('/:id', getItemById)
routers.delete('/:id', deleteItemById)
routers.post('/', upload.single('file'), createItem)
routers.put('/', updateItem)

export default routers