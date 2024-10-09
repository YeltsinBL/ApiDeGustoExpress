import { directoryPath } from '../utils.js'
import path from "path";
import { uploadSingleImageAsync } from '../middlewares/multer-config.js'; 
import { saveImageCloudinary } from '../models/image.js';

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
