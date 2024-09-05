export const getItems = async(req, res)=>{
    try {
        const listAll = [{'businessAreaId':1,'businessAreaName':'Restaurante'},
            {'businessAreaId':2,'businessAreaName':'Hoteles'},
            {'businessAreaId':3,'businessAreaName':'Cines'}
        ]
        res.send(listAll)
    } catch (e) {
        
    }
}
