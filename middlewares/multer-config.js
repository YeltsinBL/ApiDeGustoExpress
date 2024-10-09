import multer from "multer";
import fs from 'fs'
import path from "path";
import { directoryPath } from '../utils.js'
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
export const uploadSingleImageAsync = (req, res) => {
    console.log(req.body)
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