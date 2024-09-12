import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAll() {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .query('SELECT own.*, u.userName, CONVERT (varchar(10), u.userCreatedAt, 103) as [userCreatedAt] FROM Owners own '+
                                'LEFT JOIN Users u ON own.ownerId=u.user_OwnerId;')
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
                        .input('ownerId', mssql.Int, id)
                        .query('SELECT own.*, u.userName, CONVERT (varchar(10), u.userCreatedAt, 103) as [userCreatedAt] FROM Owners own '+
                            'LEFT JOIN Users u ON own.ownerId=u.user_OwnerId '+
                            'where own.ownerId=@ownerId')
        pool.close()
        return result.recordset[0]
    } catch (error) {
      console.error(error)
    }
}
export async function create ({ input }) {
    try {
      const {
        ownerName, ownerEmail, ownerPhoneNumber, userName, userPassword, userCreatedAt
      } = input

      const pool = await getConnection()

      let resultOwner = await pool.request()
        .input('ownerName', mssql.VarChar, ownerName)
        .input('ownerEmail', mssql.VarChar, ownerEmail)
        .input('ownerPhoneNumber', mssql.VarChar, ownerPhoneNumber)
        .query('Insert into Owners (ownerName, ownerEmail, ownerPhoneNumber) ' +
            'values(@ownerName,@ownerEmail,@ownerPhoneNumber); Select SCOPE_IDENTITY() as ownerId;')

      const [{ ownerId }] = resultOwner.recordset

      await pool.request()
        .input('userName',mssql.VarChar, userName)
        .input('userPassword',mssql.VarChar, userPassword)
        .input('userCreatedAt',mssql.Date, userCreatedAt)
        .input('user_OwnerId',mssql.Int, ownerId)
        .query('Insert into Users (userName, userPassword, userCreatedAt, user_OwnerId) '+
            'values(@userName, @userPassword, @userCreatedAt, @user_OwnerId)'
        )
      pool.close()
      return {'ownerId':ownerId,
            'ownerName':ownerName,
            'ownerEmail':ownerEmail,
            'ownerPhoneNumber':ownerPhoneNumber,
            'userName':userName,
            'userCreatedAt': userCreatedAt
      }
    } catch (error) {
      console.error(error)
    }
}
export async function deleteById({ id }) {
    try {
      const pool = await getConnection()
      await pool.request()
        .input('ownerId', mssql.Int, id)
        .query(
          'delete from dbo.Owners WHERE ownerId=@ownerId')

      pool.close()
      return true
    } catch (error) {
      console.log(error)
    }
}