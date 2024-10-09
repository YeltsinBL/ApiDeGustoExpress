import dotenv from 'dotenv'
dotenv.config();


export const SALT_ROUNDS = 10 // numero significa que tanto se va a encriptar


export const config = {
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    },
    dbMSSQL:{
        server: process.env.SERVER,
        database: process.env.DATABASE,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        options: {
            trustedConnection: true,
            trustServerCertificate: true
          }
    }
};