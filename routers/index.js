import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
// router.get('/', (req, res) =>{
//     res.json({'medium':'Conexión'})
// })

// router.get('*', (req, res) =>{
//     res.status(404)
//     res.send({error:'Not found router'})
// })

// obtener la ruta del archivo actual
const __fileName = fileURLToPath(import.meta.url)
const pathRouter = path.dirname(__fileName)
const removeExtension = (filename) => {
    return filename.split('.').shift()
}

fs.readdirSync(pathRouter).filter(async (file) => {
    // Remover la extension de los archivos dentro de la carpeta Routers
    const fileWithOutExt = removeExtension(file)
    // Excluir el archivo index
    const skip = ['index'].includes(fileWithOutExt)
    if(!skip){
        // importar dinámicamente las rutas
        const routeModule = await import(`./${fileWithOutExt}.js`)
        // obtener la exportación por defecto
        router.use(`/${fileWithOutExt}`, routeModule.default)
    }
})

export default router