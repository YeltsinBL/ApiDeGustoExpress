
import {getConnection, mssql} from './sql/connection_sql.js'

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
                            ' WHERE d.dish_CategoriesId = @dishCategoryId '+
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
                        .query('SELECT d.dishId, d.dishName, d.dishDescription, d.dishPrice, d.dishPhoto ' +
                            ' FROM Dishes d ' +
                            ' WHERE d.dish_BusinessId = @dishBusinessId ')
        pool.close()
        return result.recordset
    } catch (error) {
      console.error(error)
    }
}
