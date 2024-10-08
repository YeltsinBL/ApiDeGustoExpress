import express from 'express'
import dotenv from 'dotenv'
import router from './routers/index.js'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { readJson } from './utils.js'
const swagger = readJson('./swagger.json')

dotenv.config()
const app = express()

const PORT = process.env.PORT ?? 3000
app.use(cors())
app.use(express.json()) // permitir usar JSON

app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api', router)

// app.get('/', (req, res) =>{
//     res.send(true)
// })

app.use('/', swaggerUI.serve,swaggerUI.setup(swagger))


app.listen(PORT, ()=>{
    console.log(`Las APIs están corriendo en el puerto http://localhost:${PORT}`)
})