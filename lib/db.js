import Dotenv from 'dotenv';
Dotenv.config();

export const connection = {
    // host : 'process.env.DB_PORT',
    host : 'localhost', //db ip address
    port : process.env.DB_PORT, //db port number
    user : process.env.DB_USER, //db id
    password : process.env.DB_PASSWORD, //db password
    database: process.env.DB_DATABASE, //db schema name
    connectionLimit : 30 // db connection count 30
};
