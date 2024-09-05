import express from 'express'

const routers = express.Router()

routers.get('/', (req, res) =>{
    res.json({'businessArea':'Restaurante'})
})

export default routers