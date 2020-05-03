const { Pool, Client } = require('pg');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbDatabase = process.env.DB_DATABASE
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT
const dbElephantSqlConnectString = process.env.DB_ELEPHANTSQL_CONNECT_STRING;

module.exports.getPool = function getPool() {

    const pool = new Pool({
        connectionString: dbElephantSqlConnectString
    })

    console.log(pool);
    return pool;
}


