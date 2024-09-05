export const httpError = (res, err) => {
    console.log(err)
    res.status(500).json({error:'No se estableció la conexión a la bd'})
}