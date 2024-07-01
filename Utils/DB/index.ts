import mysql, {Connection, QueryError} from "mysql2/promise"
require('dotenv').config();

export const pool = mysql.createPool({
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user:process.env.NEXT_PUBLIC_DB_USER,
    port:3306,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    multipleStatements:true,
    connectionLimit: 2000,
    database:"fifa",
    connectTimeout:1000 * 30,
    queueLimit: 0,
    timezone : "+09:00",
    dateStrings:true
});

export const con=async ()=>{
    return pool.getConnection();
}

