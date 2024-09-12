import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAll() {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .query('SELECT cus.*, u.userName, CONVERT (varchar(10), u.userCreatedAt, 103) as [userCreatedAt] FROM Customers cus '+
                                'LEFT JOIN Users u ON cus.customerId=u.user_CustomerId;')
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
                        .input('customerId', mssql.Int, id)
                        .query('SELECT cus.*, u.userName, CONVERT (varchar(10), u.userCreatedAt, 103) as [userCreatedAt] FROM Customers cus '+
                            'LEFT JOIN Users u ON cus.customerId=u.user_CustomerId '+
                            'where cus.CustomerId=@customerId')
        pool.close()
        return result.recordset[0]
    } catch (error) {
      console.error(error)
    }
}
export async function create ({ input }) {
    try {
      const {
        name, email, phoneNumber, userName, password, createDate
      } = input

      const pool = await getConnection()

      let resultOwner = await pool.request()
        .input('customerName', mssql.VarChar, name)
        .input('customerEmail', mssql.VarChar, email)
        .input('customerPhoneNumber', mssql.VarChar, phoneNumber)
        .query('Insert into Customers (customerName, customerEmail, customerPhoneNumber) ' +
            'values(@customerName,@customerEmail,@customerPhoneNumber); Select SCOPE_IDENTITY() as customerId;')

      const [{ customerId }] = resultOwner.recordset

      await pool.request()
        .input('userName',mssql.VarChar, userName)
        .input('userPassword',mssql.VarChar, password)
        .input('userCreatedAt',mssql.Date, createDate)
        .input('user_CustomerId',mssql.Int, customerId)
        .query('Insert into Users (userName, userPassword, userCreatedAt, user_CustomerId) '+
            'values(@userName, @userPassword, @userCreatedAt, @user_CustomerId)'
        )
      pool.close()
      return {'customerId':customerId,
            'customerName':name,
            'customerEmail':email,
            'customerPhoneNumber':phoneNumber,
            'userName':userName,
            'userCreatedAt': createDate
      }
    } catch (error) {
      console.error(error)
    }
}
export async function deleteById({ id }) {
    try {
      const pool = await getConnection()
      await pool.request()
        .input('customerId', mssql.Int, id)
        .query(
          'delete from dbo.Customers WHERE customerId=@customerId')

      pool.close()
      return true
    } catch (error) {
      console.log(error)
    }
}