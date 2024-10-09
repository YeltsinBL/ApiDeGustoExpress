import cloudinary from "../config/cloudinary.js";
import fs from 'fs'
import path from "path";
import { directoryPath } from '../utils.js'
export async function saveImageCloudinary({params}) {
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
        return false
    }
}
