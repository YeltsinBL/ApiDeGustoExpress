import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAll() {
    try {
        const pool = await getConnection()
        let result = await pool.request().query('select * from dbo.Business;')
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}

export async function getById({id}) {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .input('businessId', mssql.Int, id)
                        .query('select * from dbo.Business'+
                            ' where businessId=@businessId')
        pool.close()
        return result.recordset[0]
    } catch (error) {
      console.error(error)
    }
}
export async function deleteById({ id }) {
    try {
      const pool = await getConnection()
      await pool.request()
        .input('businessId', mssql.Int, id)
        .query(
          'delete from dbo.Business WHERE businessId=@businessId')

      pool.close()
      return true
    } catch (error) {
      console.log(error)
    }
}