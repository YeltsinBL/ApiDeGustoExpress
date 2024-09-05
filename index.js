import express from 'express'
import dotenv from 'dotenv'
import router from './routers/index.js'

dotenv.config()
const app = express()

const PORT = process.env.PORT ?? 3000

app.use(express.json()) // permitir usar JSON

app.use('/api', router)

app.get('/', (req, res) =>{
    res.json({'nombre':'Yeltsin'})
})

app.listen(PORT, ()=>{
    console.log(`Las APIs están corriendo en el puerto http://localhost:${PORT}`)
})