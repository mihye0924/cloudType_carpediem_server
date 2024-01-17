import Dotenv from 'dotenv';
Dotenv.config();
import express from 'express'; 
import mysql from 'mysql2';
import { connection } from  '../lib/db.js';
import { sql } from  '../lib/sql.js';
import logger from '../middleware/config/logger.js';


const router = express.Router();
const pool = mysql.createPool(connection); 

router.get('/', (req, res) => { 
  const { account_name } = req.headers; 

  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.getAccountList, [account_name], function (error, results){
        if(error) throw error;     
        if(results.length > 0){  
          return res.send({ code: 200, result: results, message: 'List is successfully'})
        }else{
          return res.send({ code: 401, message: 'List is failed'})
        }
      })
    })
  }catch(error){
    logger.info("List Server Error💥", error);
    logger.error("List Server Error:", error);
  } 
})

router.get('/profile/:name', (req, res) => { 
  const account_name = req.params.name; 
  console.log(account_name,"account_name")
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.getAccountMyProfile, [account_name], function (error, results){
        if(error) throw error;     
        if(results.length > 0){ 
          return res.send({ code: 200, result: results, message: 'List Profile is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Profile is failed'})
        }
      })
    })
  }catch(error){
    logger.info("List Profile Server Error💥", error);
    logger.error("List Profile Server Error:", error);
  } 
})

export default router;