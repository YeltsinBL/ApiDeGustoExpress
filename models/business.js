import {getConnection, mssql} from './sql/connection_sql.js'
export async function getAll({input}) {
    try {
      console.log(input)
      const {userType, userTypeId} = input
      console.log(parseInt(userType),parseInt(userTypeId))
        const pool = await getConnection()
        let addWhere = ''
        if(parseInt(userType)==1) {
          addWhere='where business_OwnerId='+parseInt(userTypeId)}
        let result = await pool.request().query('select * from dbo.Business '+addWhere)
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}
export async function getAllMobile() {
  try {
      const pool = await getConnection()
      let result = await pool.request().query('select * from dbo.Business where businessStatus=2')
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

export async function create({input}) {
  try {
    const {
      businessName, businessAddress,  businessPhoneNumber,
      businessStatus, businessLogo, businessLatitude,
      businessLongitude, business_AreaId, business_OwnerId
    } = input

    const pool = await getConnection()
    let result = await pool.request()
          .input('businessName',mssql.VarChar,businessName)
          .input('businessAddress',mssql.VarChar,businessAddress)
          .input('businessPhoneNumber',mssql.VarChar,businessPhoneNumber)
          .input('businessStatus',mssql.Int,businessStatus)
          .input('businessLogo',mssql.VarChar,businessLogo)
          .input('businessLatitude',mssql.Float,businessLatitude)
          .input('businessLongitude',mssql.Float,businessLongitude)
          .input('business_AreaId',mssql.Int,business_AreaId)
          .input('business_OwnerId',mssql.Int,business_OwnerId)
          .query('Insert into Business (businessName,businessAddress,businessPhoneNumber, '+
            'businessStatus, businessLogo, businessLatitude, businessLongitude, '+
            'business_AreaId, business_OwnerId)' +
            'values(@businessName, @businessAddress, @businessPhoneNumber, @businessStatus, '+
            '@businessLogo, @businessLatitude, @businessLongitude, @business_AreaId, @business_OwnerId); '+
            'Select SCOPE_IDENTITY() as businessId;')
    pool.close()
    const [{businessId}] = result.recordset
    return {
      'businessId':businessId,
      'businessName':businessName,
      'businessAddress':businessAddress,
      'businessPhoneNumber':businessPhoneNumber,
      'businessStatus':businessStatus,
      'businessLogo':businessLogo,
      'businessLatitude':businessLatitude,
      'businessLongitude':businessLongitude,
      'business_AreaId':business_AreaId,
      'business_OwnerId':business_OwnerId
    }        
  } catch (error) {
    console.error(error)
  }
}

export async function upload({input}) {
  try {
    //console.log(input)
    const {
      businessId, businessName, businessAddress,
      businessPhoneNumber, businessStatus, businessLogo,
      businessLatitude, businessLongitude, business_AreaId,
      business_OwnerId
    } = input

    const pool = await getConnection()
    let result = await pool.request()
          .input('businessId',mssql.Int,businessId)
          .input('businessName',mssql.VarChar,businessName)
          .input('businessAddress',mssql.VarChar,businessAddress)
          .input('businessPhoneNumber',mssql.VarChar,businessPhoneNumber)
          .input('businessStatus',mssql.Int,businessStatus)
          .input('businessLogo',mssql.VarChar,businessLogo)
          .input('businessLatitude',mssql.Float,businessLatitude)
          .input('businessLongitude',mssql.Float,businessLongitude)
          .query('update Business '+
            'set businessName= @businessName, businessAddress= @businessAddress, '+
            ' businessPhoneNumber= @businessPhoneNumber, businessStatus= @businessStatus, '+
            ' businessLogo= @businessLogo, businessLatitude= @businessLatitude, '+
            ' businessLongitude= @businessLongitude ' +
            'where businessId= @businessId;'
          )
    //console.log(result)
    return {
      'businessId':businessId,
      'businessName':businessName,
      'businessAddress':businessAddress,
      'businessPhoneNumber':businessPhoneNumber,
      'businessStatus':businessStatus,
      'businessLogo':businessLogo,
      'businessLatitude':businessLatitude,
      'businessLongitude':businessLongitude,
      'business_AreaId':business_AreaId,
      'business_OwnerId':business_OwnerId
    }   
  } catch (error) {
    
  }
}

export async function uploadState({input}) {
  try {
    const {businessId, businessStatus} = input
    console.log('input: ',businessId,businessStatus)
    const pool = await getConnection()
    let result = await pool.request()
          .input('businessId',mssql.Int,businessId)
          .input('businessStatus',mssql.Int,businessStatus)
          .query('update Business '+
            'set businessStatus= @businessStatus '+
            'where businessId= @businessId;'
          )
    console.log('result: ',result)
    return {
      'businessId':businessId,
      'businessStatus':businessStatus
    }   
  } catch (error) {
    
  }
}