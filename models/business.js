import { getConnection, mssql } from '../config/connection_sql.js' 
export async function getAll({input}) {
    try {

      const { userId, businessName, businessStatus } = input
      const pool = await getConnection()

      let valid = await pool.request()
                .input('userId', mssql.Int, userId)
                .query('SELECT p.person_Type FROM Persons p ' +
                    ' JOIN Users u ON u.user_personId=p.personId '+
                    ' WHERE u.userId=@userId;'
                )
      if(valid.recordset.length==0) return {"codeStatus":400, "message":"No tienes acceso"}
      const [{person_Type}] = valid.recordset

      if(parseInt(person_Type)==2) return {"codeStatus":400, "message":"No tienes acceso"}
      // console.log(parseInt(person_Type),parseInt(userId))

      let addWhere = 'WHERE 1=1 '
      if(parseInt(person_Type)==1) addWhere +=' AND business_UserId='+parseInt(userId)
      if (businessName) addWhere += ` AND businessName LIKE '%${businessName}%'`
        
      if (typeof parseInt(businessStatus) === 'number' && !isNaN(parseInt(businessStatus))) {
        addWhere += ` AND businessStatus = ${parseInt(businessStatus)}`
      }
      let result = await pool.request().query('select * from dbo.Business '+addWhere)
      pool.close()
      return result.recordset
    } catch (error) {
      console.error(error)
    }
}


export async function getAllStates() {
  try {
      return [{"businessStatus":1,"businessStatusName":"Solicitud"},
        {"businessStatus":2,"businessStatusName":"Aprobado"},
        {"businessStatus":3,"businessStatusName":"Rechazado"}]
  } catch (error) {
    console.error(error)
  }
}
export async function getAllSearch({input}) {
  try {
      const { latitude, longitude, search } = input
      const pool = await getConnection()
      let menorQue = 99999999999
      if (typeof search != 'string' ) {
        menorQue = 0.6
        search = ''
      }
      console.log(search, menorQue)
      let result = await pool.request()
            .input('LATITUDE', mssql.Float, latitude)
            .input('LONGITUDE', mssql.Float, longitude)
            .input('search', mssql.VarChar, search)
            .input('menorQue', mssql.Float, menorQue)
            .query('SELECT [b].[businessId], ' +
              ' [b].[businessName], [b].[businessAddress], ' +
              ' [b].[businessPhoneNumber], [b].[businessStatus], ' +
              ' [b].[businessLogo], [b].[businessLatitude], ' +
              ' [b].[businessLongitude], [b].[businessCategorization], AVG(rw.reviewRating) AS businessAverageRating, ' +
              ' COUNT(rw.reviewsId) AS businessTotalReviews, ' +
              ' CASE WHEN (6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude)))) < 1 ' +
              '   THEN CONCAT(ROUND((6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude)))) * 1000, 2), \' m \') ' +
              '   ELSE CONCAT(ROUND(6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude))), 2), \' km \') ' +
              ' END AS businessDistance ' +
              '  , [ds].[dishId], [ds].[dishName], [ds].[dishDescription], [ds].[dishPrice], [ds].[dishPhoto], [ds].[dishStatus], ' +
              '   [ds].[dish_BusinessId], [ds].[dish_CategoriesId] ' +
              ' FROM Business b ' +
              ' LEFT join Dishes ds on b.businessId=ds.dish_BusinessId ' +
              ' LEFT JOIN DishCategories AS c ON ds.dish_CategoriesId = c.dishCategoryID ' +
              ' LEFT JOIN Reviews rw ON b.businessId = rw.review_BusinessId ' +
              ' WHERE [b].[businessStatus] = 2 AND [b].[business_AreaId] = 1 AND ([ds].[dishId] is null or [ds].[dishStatus] = 1) AND  CONCAT(b.businessName,\' \',ds.dishName,\' \',ds.dishDescription ) LIKE \'%\'+@search+\'%\' ' +
              ' GROUP BY [b].[businessId], [b].[businessName], ' +
              ' [b].[businessAddress], [b].[businessPhoneNumber], ' +
              ' [b].[businessStatus], [b].[businessLogo], ' +
              ' [b].[businessLatitude], [b].[businessLongitude] , [b].[businessCategorization] ' +
              '  , [ds].[dishId], [ds].[dishName], [ds].[dishDescription], [ds].[dishPrice], [ds].[dishPhoto], [ds].[dishStatus], ' +
              '   [ds].[dish_BusinessId], [ds].[dish_CategoriesId] ' +
              ' HAVING (6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude)))) < @menorQue ' + // >5km
              ' ORDER BY businessAverageRating DESC;')
      pool.close()
      if (!result.recordset.length) return [] // {"codeStatus":404, "message":"No hay restaurantes ni platos con esa descripción"}
    // Agrupa los datos por negocio
    const businessesMap = {};
    result.recordset.forEach(row => {
        if (!businessesMap[row.businessId]) {
            businessesMap[row.businessId] = {
                businessId: row.businessId,
                businessName: row.businessName,
                businessAddress: row.businessAddress,
                businessPhoneNumber: row.businessPhoneNumber,
                businessStatus: row.businessStatus,
                businessLogo: row.businessLogo,
                businessLatitude: row.businessLatitude,
                businessLongitude: row.businessLongitude,
                businessCategorization: row.businessCategorization,
                businessAverageRating: row.businessAverageRating,
                businessTotalReviews: row.businessTotalReviews,
                businessDistance: row.businessDistance,
                dishes: []
            };
        }
        // Añadir cada plato al arreglo de platos del negocio
        if (row.dishId) {  // Solo agregar si hay un plato asociado
            businessesMap[row.businessId].dishes.push({
                dishId: row.dishId,
                dishName: row.dishName,
                dishDescription: row.dishDescription,
                dishPrice: row.dishPrice,
                dishPhoto: row.dishPhoto,
                dishStatus: row.dishStatus,
                dish_BusinessId: row.dish_BusinessId,
                dish_CategoriesId: row.dish_CategoriesId
            })
        }
    })
    // Convierte el objeto de negocios en un array
    const response = Object.values(businessesMap);
    return response
  } catch (error) {
    console.error(error)
  }
}
export async function getPopularBusiness({ input }) {
  try{
    const { latitude, longitude } = input
    const pool = await getConnection()
    let result = await pool.request()
          .input('LATITUDE', mssql.Float, latitude)
          .input('LONGITUDE', mssql.Float, longitude)
          .query('SELECT TOP 5 [b].[businessId], ' +
            ' [b].[businessName], [b].[businessAddress], ' +
            ' [b].[businessPhoneNumber], [b].[businessStatus], ' +
            ' [b].[businessLogo], [b].[businessLatitude], ' +
            ' [b].[businessLongitude], [b].[businessCategorization], AVG(rw.reviewRating) AS businessAverageRating, ' +
            ' COUNT(rw.reviewsId) AS businessTotalReviews, ' +
            ' CASE WHEN (6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude)))) < 1 ' +
            '   THEN CONCAT(ROUND((6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude)))) * 1000, 2), \' m \') ' +
            '   ELSE CONCAT(ROUND(6371 * ACOS(COS(RADIANS(@LATITUDE)) * COS(RADIANS(b.businessLatitude)) * COS(RADIANS(b.businessLongitude) - RADIANS(@LONGITUDE)) + SIN(RADIANS(@LATITUDE)) * SIN(RADIANS(b.businessLatitude))), 2), \' km \') ' +
            ' END AS businessDistance ' +
            ' FROM Business b ' +
            ' LEFT JOIN Reviews rw ON b.businessId = rw.review_BusinessId ' +
            ' WHERE [b].businessStatus = 2 ' +
            ' GROUP BY [b].[businessId], [b].[businessName], ' +
            ' [b].[businessAddress], [b].[businessPhoneNumber], ' +
            ' [b].[businessStatus], [b].[businessLogo], ' +
            ' [b].[businessLatitude], [b].[businessLongitude] , [b].[businessCategorization] ' +
            ' ORDER BY businessAverageRating DESC;')
    pool.close()
    return result.recordset
  }catch (error) {
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
      businessLongitude, businessCategorization, business_AreaId, business_UserId
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
          .input('businessCategorization',mssql.Int,businessCategorization)
          .input('business_AreaId',mssql.Int,business_AreaId)
          .input('business_UserId',mssql.Int,business_UserId)
          .query('Insert into Business (businessName,businessAddress,businessPhoneNumber, '+
            'businessStatus, businessLogo, businessLatitude, businessLongitude, businessCategorization, '+
            'business_AreaId, business_UserId)' +
            'values(@businessName, @businessAddress, @businessPhoneNumber, @businessStatus, '+
            '@businessLogo, @businessLatitude, @businessLongitude, @businessCategorization, @business_AreaId, @business_UserId); '+
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
      'businessCategorization':businessCategorization,
      'business_AreaId':business_AreaId,
      'business_UserId':business_UserId
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
      businessLatitude, businessLongitude, businessCategorization, business_AreaId,
      business_UserId
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
          .input('businessCategorization',mssql.Int,businessCategorization)
          .query('update Business '+
            'set businessName= @businessName, businessAddress= @businessAddress, '+
            ' businessPhoneNumber= @businessPhoneNumber, businessStatus= @businessStatus, '+
            ' businessLogo= @businessLogo, businessLatitude= @businessLatitude, '+
            ' businessLongitude= @businessLongitude, businessCategorization= @businessCategorization ' +
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
      'businessCategorization':businessCategorization,
      'business_AreaId':business_AreaId,
      'business_UserId':business_UserId
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