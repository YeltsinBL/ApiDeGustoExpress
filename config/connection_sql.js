import mssql from 'mssql'
import { config } from './config.js'

export async function getConnection () {
  try {
    return await mssql.connect(config.dbMSSQL)
  } catch (error) {
    console.log('SQL:',error)
  }
}

export { mssql }