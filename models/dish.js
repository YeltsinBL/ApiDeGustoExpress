
import {getConnection} from './sql/connection_sql.js'

export async function getAll() {
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