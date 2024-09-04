import express from 'express'

const app = express()

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) =>{
    res.json({'nombre':'Yeltsin'})
})

app.listen(PORT, ()=>{
    console.log(`Las APIs están corriendo en el puerto http://localhost:${PORT}`)
})