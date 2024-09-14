import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAccount ({ input }) {
    try {
        const {userName, userPassword} = input
        const pool = await getConnection()
        let result = await pool.request()
                .input('userName', mssql.VarChar, userName)
                .input('userPassword', mssql.VarChar, userPassword)
                .query('SELECT u.userName, userTypeId=ISNULL(ISNULL(u.user_CustomerId, user_OwnerId),0), '+
                        'case when u.user_CustomerId is NULL and u.user_OwnerId is NULL THEN 0 '+
                        '       when user_CustomerId is null then 1 else 2 end as [userType]'+
                        'FROM Users u '+
                        'WHERE u.userName=@userName AND u.userPassword=@userPassword'
                    )
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}