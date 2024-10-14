import { httpError } from "../helpers/handleError.js"
import { getAll, getById,deleteById, create, upload, getAllMobile, uploadState, getAllStates , getPopularBusiness} from '../models/business.js'
import { uploadSingleImageAsync } from "../middlewares/multer-config.js";
import { saveImageCloudinary } from '../models/image.js'

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
        const listAll = await getAllMobile({input: req.query})
        res.send(listAll)

    } catch (e) {
        httpError(res,e)
    }
}
export const getItemsPopular = async(req, res)=>{
    try {
        const listAll = await getPopularBusiness({input: req.query})
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
        if(req.file)
        {
          const datos = {filePath:req.file.path,bodyName:req.body.businessName}
          const imgURLCloudinary = await saveImageCloudinary({  params: datos })
          if(imgURLCloudinary === false) return res.status(404).json({message:'No se pudo guardar la imagen.'})
          req.body.businessLogo = imgURLCloudinary
        } else {
            req.body.businessLogo = ''
            console.log("Business sin logo");
        }
      
        const result = await create({ input: req.body })
        res.status(201).json(result)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
        // httpError(res,error)
    }
}
export const updateItem = async(req, res) =>{
    try {
        await uploadSingleImageAsync(req,res)
        const {id} = req.params
        req.body.businessId = id
        if(req.file) {
          const datos = {filePath:req.file.path,bodyBusinessName:req.body.businessName}
          const imgURLCloudinary = await saveImageCloudinary({  params: datos })
          if(imgURLCloudinary === false) return res.status(404).json({message:'No se pudo guardar la imagen.'})
          req.body.businessLogo = imgURLCloudinary
        }
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