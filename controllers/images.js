import { directoryPath } from '../utils.js'
import multer from "multer";
import fs from 'fs'
import path from "path";
import {uploadSingleImageAsync} from "./business.js"
import cloudinary from '../config/cloudinary.js'

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
        const dir = './images'.concat(`/${req.body.businessName}`, '/logo');
        const storeFolder = directoryPath.concat(dir.substring(2))
        if (!fs.existsSync(storeFolder)) {
            fs.mkdirSync(storeFolder, { recursive: true });
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        if(!file) return
        const dir = './images'.concat(`/${req.body.businessName}`, '/logo');
        // Verificar si ya existe algún archivo en la carpeta
        fs.readdir(dir, (err, files) => {
          if (err) {
              return cb(err);
          }
          console.log(files.length)
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
        //cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage, fileFilter: imageFilter })

const uploadSingleImage = upload.single('file')
export const saveImage = async (req, res) => {
    try {
    //     uploadSingleImage(req, res, function (err) {
    //         console.log(err)
    //         if(err) return res.status(400).json({message: err.message})
        
    //     // // Paso 1: Guardar la data del body
    //     const { businessName, businessAddress, businessPhoneNumber } = req.body;

    //     if (!businessName || !businessAddress || !businessPhoneNumber) {
    //         return res.status(400).json({ message: 'Faltan datos en el cuerpo de la solicitud' });
    //     }

    //     // Paso 2: Manejar los archivos después de los datos

    //     const files = req.file;

    //     if (!files || files.length === 0) {
    //         return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    //     }

    //     // Responder con los detalles de los archivos subidos y los datos guardados
    //     res.status(201).json({
    //         message: 'Data guardada e imágenes subidas exitosamente',
    //         files: {
    //             filename: files.filename,
    //             path: files.path
    //         },
    //         body: req.body
    //     });
    // })

        await uploadSingleImageAsync(req,res)
        const secure_url = await saveImageCloudinary(
            {params:
                {filePath:req.file.path,bodyBusinessName:req.body.businessName}
            }
        )
        
        console.log('secure_url',secure_url)
        
        return res.status(201).json({
            message: 'Data guardada e imágenes subidas exitosamente',
            files: {
                filename: "files.filename",
                path: secure_url
            },
            body: req.body
        });
    } catch (error) {
        
    }
}

export const viewImage = async (req, res) => {
    const {root, name, type, image} = req.params;
    // Ruta completa a la imagen
    const imagePath = path.join(directoryPath, root, name, type, image);
    console.log(imagePath)
    // Verificar si la imagen existe
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'Imagen no encontrada' });
        }
    });
}

async function saveImageCloudinary({params}) {
    try {
        const {filePath, bodyBusinessName} = params
        const img = path.join(directoryPath, filePath)
        // Upload image to Cloudinary
        const result = await cloudinary.uploader
            .upload(img , {
                public_id: bodyBusinessName
                ,folder:'test'
            })
            .catch((error) => {
                console.log('cloudinaryUploader',error);
                return false
            })
        fs.rmSync(path.join(directoryPath,'images',bodyBusinessName), { recursive: true })
        return result.secure_url
    } catch (error) {
        console.log('saveImageCloudinary',error)
    }
}
