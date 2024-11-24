import { SALT_ROUNDS } from '../config/config.js' 
import {getConnection, mssql} from '../config/connection_sql.js'
import bcrypt from 'bcrypt'
export async function getAccount ({ input }) {
    try {
        const {userName, userPassword} = input
        const pool = await getConnection()
        let result = await pool.request()
                .input('userName', mssql.VarChar, userName)
                .query('SELECT uId=u.userId, uName=u.userName, uStatus=u.userStatus, userPasswordHash=u.userPassword, pEmail=p.personEmail, person_TypeId=p.person_Type '+
                    'FROM Users u '+
                    'JOIN Persons p ON u.user_personId = p.personId ' +
                    'WHERE u.userName=@userName;'
                )
        if(result.recordset.length==0) return {"codeStatus":400, "message":"Usuario incorrecto"}
        const [{uId, uName, uStatus,userPasswordHash, pEmail, person_TypeId}] = result.recordset
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
            userStatus:uStatus,
            personEmail: pEmail,
            person_TypeId:person_TypeId
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
    const {
      personTypeId, name, email, phoneNumber,
      userName, password, createDate,
    } = input

  // Conectar al pool de base de datos
  const pool = await getConnection()
  // Validar que el pool esté conectado
  if (!pool.connected) {
    throw new Error('La conexión al pool no se estableció correctamente.');
  }
  const transaction = new mssql.Transaction()
  try {
    // Iniciar transacción
    await transaction.begin();
    // Encriptar la contraseña antes de la inserción
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userStatus = personTypeId == 1 ? 0 : 1;
    // Insertar en Persons
    const resultPerson = await pool
      .request()
      .input('personName', mssql.VarChar, name)
      .input('personEmail', mssql.VarChar, email)
      .input('personPhoneNumber', mssql.VarChar, phoneNumber)
      .input('personType', mssql.Int, personTypeId)
      .query(
        `INSERT INTO Persons (personName, personEmail, personPhoneNumber, person_Type) 
         VALUES (@personName, @personEmail, @personPhoneNumber, @personType); 
         SELECT SCOPE_IDENTITY() AS personId;`
      );

    const [{ personId }] = resultPerson.recordset;

    // Insertar en Users
    const resultUser = await pool
      .request()
      .input('userName', mssql.VarChar, userName)
      .input('userPassword', mssql.VarChar, hashedPassword)
      .input('userStatus', mssql.Int, userStatus)
      .input('userCreatedAt', mssql.Date, createDate)
      .input('user_personId', mssql.Int, personId)
      .query(
        `INSERT INTO Users (userName, userPassword, userStatus, userCreatedAt, user_PersonId) 
         VALUES (@userName, @userPassword, @userStatus, @userCreatedAt, @user_personId); 
         SELECT SCOPE_IDENTITY() AS userId;`
      );

    const [{ userId }] = resultUser.recordset;

    // Consultar el nombre del tipo de persona
    const resultPersonType = await pool
      .request()
      .input('personTypeId', mssql.Int, personTypeId)
      .query(
        `SELECT personTypeName 
         FROM PersonTypes 
         WHERE personTypeId = @personTypeId`
      );

    const [{ personTypeName }] = resultPersonType.recordset;

    // Confirmar la transacción
    await transaction.commit();

    // Cerrar conexión y devolver resultado
    pool.close();
    return {
      userId,
      userName,
      personName: name,
      personEmail: email,
      personPhoneNumber: phoneNumber,
      personTypeName,
      userStatus,
      userCreatedAt: createDate,
    };
  } catch (error) {
    return await handleErrorTransact({transaction, error, email, userName})
  } finally {
    // Asegurar que la conexión se cierra
    if (pool) pool.close();
  }
}
export async function deleteById({ id }) {
    const pool = await getConnection()
    // Validar que el pool esté conectado
    if (!pool.connected) {
      throw new Error('La conexión al pool no se estableció correctamente.');
    }
    const transaction = new mssql.Transaction()
    try {
      // Iniciar transacción
      await transaction.begin();
      let verifyUser = await pool.request()
        .input('userId', mssql.Int, id)
        .query(
          'SELECT userId FROM Users u WHERE u.userId=@userId')
      
      // Validar si hay resultados en la consulta
      if (!verifyUser.recordset.length) {
        return await handleErrorTransact({
          transaction,
          error:{code:"EREQUEST", number: 547, message:"userId"}}
        )
      }
      await pool.request()
        .input('userId', mssql.Int, id)
        .query(
          'UPDATE Users set userStatus=2 WHERE userId=@userId')

      await transaction.commit();
      pool.close();
      return true
    } catch (error) {
      console.log(error)
      return await handleErrorTransact({transaction, error})
    } finally {
      // Asegurar que la conexión se cierra
      if (pool) pool.close();
    }
}
export async function upload({input}) {
  const {
    userId, personTypeId, userStatus
  } = input
  const pool = await getConnection()
  // Validar que el pool esté conectado
  if (!pool.connected) {
    throw new Error('La conexión al pool no se estableció correctamente.');
  }
  const transaction = new mssql.Transaction()
  try {
    // Iniciar transacción
    await transaction.begin();
    let verifyTypePerson = await pool.request()
        .input('userId', mssql.Int, userId)
        .query('SELECT p.person_Type FROM Persons p '+
                'JOIN Users u ON p.personId = u.user_personId '+
                'WHERE u.userId=@userId')
      
      // Validar si hay resultados en la consulta
      if (!verifyTypePerson.recordset.length) {
        return await handleErrorTransact({
          transaction,
          error:{code:"EREQUEST", number: 547, message:"userId"}}
        )
      }
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
      if (userStatus > 3) {
        return await handleErrorTransact({
          transaction,
          error:{code:"EREQUEST", number: 547, message:"userStatus"}}
        )
      }
      await pool.request()
          .input('userId',mssql.Int,userId)
          .input('userStatus',mssql.Int,userStatus)
          .query('update Users '+
            ' set userStatus=@userStatus '+
            'where userId = @userId;'
          )
    
    // Confirmar la transacción
    await transaction.commit();
    pool.close();
    return {
      'userId':userId,
      'personTypeId':personTypeId,
      'userStatus':userStatus
    }   
  } catch (error) {
    
    return await handleErrorTransact({transaction, error})
    
  } finally {
    // Asegurar que la conexión se cierra
    if (pool) pool.close();
  }
}
async function handleErrorTransact({transaction, error, email, userName}) {
  //console.log('error.message', error.message)
  // Revertir transacción si ocurre un error
  if (transaction.isActive) {
    await transaction.rollback();
  }
  if (error.code === 'EREQUEST') {
    if(error.number === 2627) {  // Analizar el mensaje de error para identificar la columna
      if (error.message.includes(email)) {
        return {
          codeStatus: 409,
          message: 'El correo electrónico ya está registrado.',
          // details: error.message,
        }
      } else if (error.message.includes(userName)) {
        return {
          codeStatus: 409,
          message: 'El nombre de usuario ya está registrado.',
          // details: error.message,
        }
      }
    }
    if(error.number === 547) {
      if(error.message.includes('personTypeId')) {
        return {
          codeStatus: 409,
          message: 'Tipo de Persona no encontrado.',
          // details: error.message,
        }
      }
      if(error.message.includes('userId')) {
        return {
          codeStatus: 409,
          message: 'Usuario no encontrado.',
          // details: error.message,
        }
      }
      if(error.message.includes('userStatus')) {
        return {
          codeStatus: 409,
          message: 'Estado de usuario no encontrado.',
          // details: error.message,
        }
      }
    }
  }
  // Manejar otros errores (500 por defecto)
  console.error('Error en la transacción:', error);
  return {
    codeStatus: 500,
    message: 'No se pudo guardar la información del usuario.',
    // details: error.message,
  }
}
