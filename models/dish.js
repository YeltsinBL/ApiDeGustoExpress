
import {getConnection, mssql} from '../config/connection_sql.js'

export async function getDishCategory() {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .query('SELECT x.dishCategoryID, x.dishCategoryName FROM( ' +
                            'SELECT top 5 dc.dishCategoryID, dc.dishCategoryName, COUNT(rd.detail_DishID) AS TotalDishesReserved ' +
                            'FROM DishCategories dc ' +
                            'JOIN Dishes d ON dc.dishCategoryID = d.dish_CategoriesId ' +
                            'JOIN ReservationDetails rd ON d.dishId = rd.detail_DishID ' +
                            'GROUP BY dc.dishCategoryID,dc.dishCategoryName ' +
                            'ORDER BY TotalDishesReserved DESC ' +
                            ')as x;')
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}

export async function getPopularDish({dishCategoryId}) {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .input('dishCategoryId',mssql.Int,dishCategoryId)
                        .query('SELECT X.dishId, X.dishName, X.dishDescription, X.dishPrice, X.dishPhoto FROM ( ' +
                            ' SELECT TOP 5 d.dishId, d.dishName, d.dishDescription, d.dishPrice, d.dishPhoto, COUNT(rd.detail_DishID) AS TotalReservations ' +
                            ' FROM Dishes d ' +
                            ' JOIN ReservationDetails rd ON d.dishId = rd.detail_DishID ' +
                            ' WHERE d.dish_CategoriesId = @dishCategoryId AND d.dishStatus=1 '+
                            ' GROUP BY d.dishId, d.dishName, d.dishDescription, d.dishPrice, d.dishPhoto ' +
                            ' ORDER BY TotalReservations DESC ' +
                            ' ) as X;')
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}

export async function getDishByBusinessId({dishBusinessId}) {
    try {
        const pool = await getConnection()
        let result = await pool.request()
                        .input('dishBusinessId',mssql.Int,dishBusinessId)
                        .query('SELECT d.dishId, d.dishName, d.dishDescription, d.dishPrice, d.dishPhoto, d.dishStatus ' +
                            ' FROM Dishes d ' +
                            ' WHERE d.dish_BusinessId = @dishBusinessId ')
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
                      .input('dishId', mssql.Int, id)
                      .query('select * from dbo.Dishes'+
                          ' where dishId=@dishId')
      pool.close()
      return result.recordset[0]
  } catch (error) {
    console.error(error)
  }
}

export async function create({input}) {
    try {
      const {
        dishName,  dishDescription,
        dishPrice, dishPhoto, dish_BusinessId,
        dish_CategoriesId
      } = input
  
      const pool = await getConnection()
      let result = await pool.request()
            .input('dishName',mssql.VarChar,dishName)
            .input('dishDescription',mssql.VarChar,dishDescription)
            .input('dishPrice',mssql.Float,dishPrice)
            .input('dishPhoto',mssql.VarChar,dishPhoto)
            .input('dish_BusinessId',mssql.Int,dish_BusinessId)
            .input('dish_CategoriesId',mssql.Int,dish_CategoriesId)
            .query('Insert into Dishes (dishName,dishDescription,dishPrice, '+
              'dishPhoto, dishStatus, dish_BusinessId, dish_CategoriesId)' +
              'values(@dishName, @dishDescription, @dishPrice, @dishPhoto, 1, '+
              '@dish_BusinessId, @dish_CategoriesId); '+
              'Select SCOPE_IDENTITY() as dishId;')
      pool.close()
      const [{dishId}] = result.recordset
      return {
        'dishId':dishId,
        'dishName':dishName,
        'dishDescription':dishDescription,
        'dishPrice':dishPrice,
        'dishPhoto':dishPhoto,
        'dishStatus':true,
        'dish_BusinessId':dish_BusinessId,
        'dish_CategoriesId':dish_CategoriesId
      }        
    } catch (error) {
      console.error(error)
    }
  }
  export async function update({input}) {
    try {
      const {
        dishId, dishName,  dishDescription,
        dishPrice, dishPhoto, dishStatus, dish_BusinessId,
        dish_CategoriesId
      } = input
  
      const pool = await getConnection()
      await pool.request()
            .input('dishId',mssql.Int,dishId)
            .input('dishName',mssql.VarChar,dishName)
            .input('dishDescription',mssql.VarChar,dishDescription)
            .input('dishPrice',mssql.Float,dishPrice)
            .input('dishPhoto',mssql.VarChar,dishPhoto)
            .input('dishStatus', mssql.Bit,dishStatus)
            .input('dish_BusinessId',mssql.Int,dish_BusinessId)
            .input('dish_CategoriesId',mssql.Int,dish_CategoriesId)
            .query('Update Dishes set dishName=@dishName, '+
              'dishDescription=@dishDescription, dishPrice=@dishPrice, dishPhoto=@dishPhoto, ' +
              'dishStatus=@dishStatus, dish_BusinessId=@dish_BusinessId, dish_CategoriesId=@dish_CategoriesId '+
              'where dishId=@dishId;')
      pool.close()
      return {
        'dishId':dishId,
        'dishName':dishName,
        'dishDescription':dishDescription,
        'dishPrice':dishPrice,
        'dishPhoto':dishPhoto,
        'dishStatus':dishStatus,
        'dish_BusinessId':dish_BusinessId,
        'dish_CategoriesId':dish_CategoriesId
      }        
    } catch (error) {
      console.error(error)
    }
}
export async function deleteById({ id }) {
    try {
      const pool = await getConnection()
      await pool.request()
        .input('dishId', mssql.Int, id)
        .query(
          'UPDATE Dishes SET dishStatus=0 WHERE dishId=@dishId')

      pool.close()
      return true
    } catch (error) {
      console.log(error)
    }
}
