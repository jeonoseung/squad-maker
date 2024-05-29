import mariadb from 'mariadb';
require('dotenv').config();

export const pool = mariadb.createPool({
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user:process.env.NEXT_PUBLIC_DB_USER,
    port:3306,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    multipleStatements:true,
    connectionLimit: 500,
    database:"fifa",
    connectTimeout:1000 * 10
});