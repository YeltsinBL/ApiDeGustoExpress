import {getConnection, mssql} from '../config/connection_sql.js'

export async function create ({ input }) {
    try {
      const {
        reviewRating, reviewComment, reviewCreateAt, review_UserId, review_BusinessId
      } = input
      
      const pool = await getConnection()

      await pool.request()
        .input('reviewRating', mssql.Int, reviewRating)
        .input('reviewComment', mssql.VarChar, reviewComment)
        .input('reviewCreateAt', mssql.VarChar, reviewCreateAt)
        .input('review_UserId', mssql.Int, review_UserId)
        .input('review_BusinessId', mssql.Int, review_BusinessId)
        .query('INSERT INTO Reviews (reviewRating, reviewComment, reviewCreateAt, review_UserId, review_BusinessId) ' +
            'values(@reviewRating, @reviewComment, @reviewCreateAt, @review_UserId, @review_BusinessId); ')
            return {"codeStatus":201, "message":"Comentario guardada satisfactoriamente"};
    } catch (error) {
        console.error(error)
    }
}