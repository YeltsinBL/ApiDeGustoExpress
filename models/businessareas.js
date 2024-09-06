import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAll() {
    try {
        // return [{'businessAreaId':1,'businessAreaName':'Restaurante'},
        //     {'businessAreaId':2,'businessAreaName':'Hoteles'},
        //     {'businessAreaId':3,'businessAreaName':'Cines'}
        // ]
        const pool = await getConnection()
        let result = await pool.request().query('select * from dbo.BusinessArea;')
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}