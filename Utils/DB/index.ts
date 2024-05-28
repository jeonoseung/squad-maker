const mariadb = require('mariadb');
export const pool = mariadb.createPool({
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user:process.env.NEXT_PUBLIC_DB_USER,
    port:process.env.NEXT_PUBLIC_DB_PORT,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    connectionLimit: 151,
    database:"fifa"
});