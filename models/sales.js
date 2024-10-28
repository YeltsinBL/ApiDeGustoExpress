import {getConnection, mssql} from '../config/connection_sql.js'

export async function create ({ input }) {
    try {
      const {
        reservationTime, reservationNumberPeople, reservationPaymentAmount, reservationPhoto, reservation_UserId, reservation_BusinessId, reservationDetails
      } = input
      
      const pool = await getConnection()

      let resultPerson = await pool.request()
        .input('reservationTime', mssql.VarChar, reservationTime)
        .input('reservationNumberPeople', mssql.Int, reservationNumberPeople)
        .input('reservationPaymentAmount', mssql.Float, reservationPaymentAmount)
        .input('reservationPhoto', mssql.VarChar, reservationPhoto)
        .input('reservation_UserId', mssql.Int, reservation_UserId)
        .input('reservation_BusinessId', mssql.Int, reservation_BusinessId)
        .query('INSERT INTO Reservations (reservationTime, reservationNumberPeople, reservationPaymentAmount, reservationPaymentStatus, reservationPhoto, reservation_UserId, reservation_BusinessId) ' +
            'values(@reservationTime, @reservationNumberPeople, @reservationPaymentAmount, 1, @reservationPhoto, @reservation_UserId, @reservation_BusinessId); Select SCOPE_IDENTITY() as reservationId;')
      const [{ reservationId }] = resultPerson.recordset

      reservationDetails.forEach(async element => {
        const {reservationDetailQuantity, reservationDetailPrice, detail_DishId} = element
        
        await pool.request() 
            .input('reservationDetailQuantity',mssql.Int, reservationDetailQuantity)
            .input('reservationDetailPrice',mssql.Float, reservationDetailPrice)
            .input('detail_DishId',mssql.Int, detail_DishId)
            .input('detail_ReservationId',mssql.Int, reservationId)
            .query('Insert into ReservationDetails (reservationDetailQuantity, reservationDetailPrice, detail_DishId, detail_ReservationId) '+
                'values(@reservationDetailQuantity, @reservationDetailPrice, @detail_DishId, @detail_ReservationId); '
            )
      })
      return {"codeStatus":201, "message":"Reservación guardada satisfactoriamente"};
    } catch (error) {
      console.error(error)
    }
}