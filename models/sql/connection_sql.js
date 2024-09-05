import mssql from 'mssql'

const config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
}

export async function getConnection () {
  try {
    return await mssql.connect(config) // retorna una promesa por eso se usa await
  } catch (error) {
    console.log('SQL:',error)
  }
}
export { mssql }