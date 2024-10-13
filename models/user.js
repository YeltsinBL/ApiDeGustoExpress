import { SALT_ROUNDS } from '../config/config.js' 
import {getConnection, mssql} from '../config/connection_sql.js'
import bcrypt from 'bcrypt'
export async function getAccount ({ input }) {
    try {
        const {userName, userPassword} = input
        const pool = await getConnection()
        let result = await pool.request()
                .input('userName', mssql.VarChar, userName)
                .query('SELECT uId=u.userId, uName=u.userName, uStatus=u.userStatus, userPasswordHash=u.userPassword '+
                    'FROM Users u '+
                    'WHERE u.userName=@userName;'
                )
        if(result.recordset.length==0) return {"codeStatus":400, "message":"Usuario incorrecto"}
        const [{uId, uName, uStatus,userPasswordHash}] = result.recordset
        const isValid = await bcrypt.compare(userPassword, userPasswordHash)
        if(!isValid) return {"codeStatus":400, "message":"Contraseña incorrecta"};
        if(uStatus == 2) return {"codeStatus":403, "message":"Cuenta suspendida."};

        // let result = await pool.request()
        //         .input('userName', mssql.VarChar, userName)
        //         .input('userPassword', mssql.VarChar, userPassword)
        //         .query('SELECT u.userId, u.userName, u.userStatus '+
        //                 'FROM Users u '+
        //                 'WHERE u.userName=@userName AND u.userPassword=@userPassword;'
        //             )
        pool.close()
        // return result.recordset
        return {
            userId: uId,
            userName: uName,
            userStatus:uStatus
        }
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

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
      const userStatus = personTypeId==1?0:1
      let resultUser = await pool.request()
        .input('userName',mssql.VarChar, userName)
        .input('userPassword',mssql.VarChar, hashedPassword)
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
export async function upload({input}) {
  try {
    //console.log(input)
    const {
      userId, personTypeId, userStatus
    } = input

    const pool = await getConnection()
    let verifyTypePerson = await pool.request()
        .input('userId', mssql.Int, userId)
        .query('SELECT p.person_Type FROM Persons p '+
                'JOIN Users u ON p.personId = u.user_personId '+
                'WHERE u.userId=userId')
      const [{ person_Type }] = verifyTypePerson.recordset
      if (person_Type != personTypeId) {
        await pool.request()
          .input('userId',mssql.Int,userId)
          .input('personTypeId',mssql.Int,personTypeId)
          .query('update Persons '+
            ' set person_Type=@personTypeId '+
            'where personId = (select user_personId FROM Users WHERE userId = @userId);'
          )
      }
      await pool.request()
          .input('userId',mssql.Int,userId)
          .input('userStatus',mssql.Int,userStatus)
          .query('update Users '+
            ' set userStatus=@userStatus '+
            'where userId = @userId;'
          )
    
    //console.log(result)
    return {
      'userId':userId,
      'personTypeId':personTypeId,
      'userStatus':userStatus
    }   
  } catch (error) {
    
  }
}
