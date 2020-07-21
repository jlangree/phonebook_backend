require('dotenv').config()

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

const dbConfig = { dbName, dbUser, dbPassword }

module.exports = dbConfig