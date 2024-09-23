import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAccount ({ input }) {
    try {
        const {userName, userPassword} = input
        const pool = await getConnection()
        let result = await pool.request()
                .input('userName', mssql.VarChar, userName)
                .input('userPassword', mssql.VarChar, userPassword)
                .query('SELECT u.userId, u.userName, u.userStatus '+
                        'FROM Users u '+
                        'WHERE u.userName=@userName AND u.userPassword=@userPassword AND u.userStatus !=2'
                    )
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}
export async function getAll() {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .query('SELECT u.userId, u.userName, u.userCreatedAt, u.userStatus, p.PersonName, p.personEmail, p.personPhoneNumber, pt.personTypeName ' +
                        'FROM Users u '+
                        'INNER JOIN Persons p on u.user_PersonId=p.PersonId ' +
                        'INNER JOIN PersonTypes pt on p.person_Type=pt.personTypeId;')
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
                        .input('userId', mssql.Int, id)
                        .query('SELECT u.userId, u.userName, u.userCreatedAt, u.userStatus, p.PersonName, p.personEmail, p.personPhoneNumber, pt.personTypeName ' +
                        'FROM Users u '+
                        'INNER JOIN Persons p on u.user_PersonId=p.PersonId ' +
                        'INNER JOIN PersonTypes pt on p.person_Type=pt.personTypeId '+
                        'where u.userId=@userId')
        pool.close()
        return result.recordset[0]
    } catch (error) {
      console.error(error)
    }
}
export async function create ({ input }) {
    try {
      const {
        personTypeId, name, email, phoneNumber, userName, password, createDate
      } = input

      const pool = await getConnection()

      let resultPerson = await pool.request()
        .input('personName', mssql.VarChar, name)
        .input('personEmail', mssql.VarChar, email)
        .input('personPhoneNumber', mssql.VarChar, phoneNumber)
        .input('personType', mssql.Int, personTypeId)
        .query('INSERT INTO Persons (personName, personEmail, personPhoneNumber, person_Type) ' +
            'values(@personName, @personEmail, @personPhoneNumber, @personType); Select SCOPE_IDENTITY() as personId;')
      const [{ personId }] = resultPerson.recordset

      const userStatus = personTypeId==1?0:1
      let resultUser = await pool.request()
        .input('userName',mssql.VarChar, userName)
        .input('userPassword',mssql.VarChar, password)
        .input('userStatus',mssql.Int, userStatus)
        .input('userCreatedAt',mssql.Date, createDate)
        .input('user_personId',mssql.Int, personId)
        .query('Insert into Users (userName, userPassword, userStatus, userCreatedAt, user_PersonId) '+
            'values(@userName, @userPassword, @userStatus, @userCreatedAt, @user_personId); Select SCOPE_IDENTITY() as userId;'
        )
      const [{ userId }] = resultUser.recordset

      let result = await pool.request()
        .input('personTypeId', mssql.Int, personTypeId)
        .query('SELECT * FROM PersonTypes '+
                'WHERE personTypeId=@personTypeId')
      const [{ personTypeName }] = result.recordset

      pool.close()
      return {'userId':userId,
            'userName':name,
            'personName':userName,
            'personEmail':email,
            'personPhoneNumber':phoneNumber,
            'personTypeName':personTypeName,
            'userStatus': userStatus,
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
        .input('userId', mssql.Int, id)
        .query(
          'UPDATE Users set userStatus=2 WHERE userId=@userId')

      pool.close()
      return true
    } catch (error) {
      console.log(error)
    }
}