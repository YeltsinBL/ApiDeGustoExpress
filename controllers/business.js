import multer from "multer";
import fs from 'fs'
import path from "path";
import { directoryPath } from '../utils.js'
import { httpError } from "../helpers/handleError.js"
import { getAll, getById,deleteById, create, upload, getAllMobile, uploadState, getAllStates , getPopularBusiness} from '../models/business.js'

// Función para verificar si el archivo es una imagen
const imageFilter = (req, file, cb) => {
    // Verificar la extensión del archivo
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Acepta el archivo
    } else {
        return cb(new Error('Solo se permiten archivos de imagen')); // Rechaza el archivo
    }
};
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
        const dir = './images'.concat(`/${req.body.businessName.replace(/\s/g,'')}`, '/logo');
        // Verificar si ya existe algún archivo en la carpeta
        fs.readdir(dir, (err, files) => {
          if (err)return cb(err)
          // Si hay archivos, eliminarlos
          if (files.length > 0) {
              files.forEach(existingFile => {
                  const existingFilePath = path.join(dir, existingFile);
                  fs.unlinkSync(existingFilePath); // Eliminar el archivo
                  console.log(`Archivo existente ${existingFile} eliminado.`);
              });
          }
          // Crear un nuevo nombre de archivo único o conservar el nombre original
          const uniqueFilename = Date.now() + path.extname(file.originalname); // Nombre único para evitar colisiones
          cb(null, uniqueFilename);  // Guardar el nuevo archivo con un nombre único
        });
    }
  })

const uploadImage = multer({ storage: storage, fileFilter: imageFilter })

const uploadSingleImage = uploadImage.single('file')
const uploadSingleImageAsync = (req, res) => {
    return new Promise((resolve, reject) => {
        uploadSingleImage(req, res, (err) => {
            if (err) {
                reject(err); // Rechaza la promesa si ocurre un error
            } else {
                resolve(req.file); // Resuelve la promesa con el archivo subido
            }
        });
    });
};
export const getItems = async(req, res)=>{
    try {
        const listAll = await getAll({input: req.query})
        if(listAll.codeStatus) return res.status(listAll.codeStatus).json({message:listAll.message})
        res.send(listAll)

    } catch (e) {
        httpError(res,e)
    }
}
export const getItemsMobile = async(req, res)=>{
    try {
        const listAll = await getAllMobile()
        res.send(listAll)

    } catch (e) {
        httpError(res,e)
    }
}
export const getItemsPopular = async(req, res)=>{
    try {
        const listAll = await getPopularBusiness()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}

export const getItemById = async(req, res) => {
    try {
        const {id} = req.params
        const business = await getById({id})
        if (business) return res.json(business)
        res.status(404).json({ message: 'Negocio no encontrada' })
    } catch (e) {
        httpError(res,e)
    }
}
export const getItemsStates = async(req, res)=>{
    try {
        const listAll = await getAllStates()
        res.send(listAll)
    } catch (e) {
        httpError(res,e)
    }
}
export const deleteItemById = async(req, res) =>{
    try {
        const {id} =req.params
        const result = await deleteById({id})
        if (result === false) {
            return res.status(404).json({ message: 'Negocio no encontrada' })
          }
      
          return res.json({ message: 'Negocio eliminada' }) 
    } catch (e) {
        
    }
}
export const createItem = async(req, res) =>{
    try {
        await uploadSingleImageAsync(req,res)
        req.body.businessLogo = req.file.path
        const result = await create({ input: req.body })
        res.status(201).json(result)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
        // httpError(res,error)
    }
}
export const updateItem = async(req, res) =>{
    try {
        console.log('aquí')
        await uploadSingleImageAsync(req,res)
        const {id} = req.params
        req.body.businessId = id
        if(req.file) req.body.businessLogo = req.file.path
        const result = await upload({input: req.body})
        res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({message: error.message})
        // httpError(res,e)
    }
}
export const updateStates = async(req, res) => {
    try {
        console.log('controller: ', req.body)
        if(![1,2,3].includes(req.body.businessStatus)) return res.status(400).json({message:'Valor de estado invalida.'})
        const business = await uploadState({input:req.body})
        if (business) return res.json(business)
        res.status(404).json({ message: 'Estado del Negocio no actualizado' })
    } catch (e) {
        httpError(res,e)
    }
}