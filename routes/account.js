import Dotenv from 'dotenv';
Dotenv.config();
import express from 'express'; 
import mysql from 'mysql2';
import { connection } from  '../lib/db.js'; 
import {sql} from '../lib/sql.js';
import logger from '../middleware/config/logger.js';

const router = express.Router();
const pool = mysql.createPool(connection); 


// 계정 찾기
router.get('/:id',  (req, res) => {   
  const user_id = req.params.id;    
  try {
     pool.getConnection(function (err, conn) {
      if(err) throw err;
       conn.query(sql.getAccountList, [user_id], function (error, results){
        if(error) throw error;   
        if(results.length > 0){
          return res.send({ code: 200, result: results, message: 'Account is successfully'})
        }else{
          return res.send({ code: 401, message: 'Account is failed'})
        }
      })
    })
  }catch(error){
    logger.info("Account Server Error💥", error);
    logger.error("Account Server Error:", error);
  } 
})

// 계정 닉네임 체크
router.get('/checkName/:name', (req, res) => {    
  const user_name = req.params.name;    
  try{
    pool.getConnection(function(err, conn){
      if(err) throw err;
      conn.query(sql.accountNameCheck, [user_name], function(error, results) {
        
        if(error) throw error;      
        if(results.length < 1) {
          return res.send({ code: 200, message: 'Name Check is Successfully' });
        }else{
          return res.send({ code: 401, message: 'Name Check is failed'})
        } 
      })
    })
  }catch(error){
    logger.info("Name Check Server Error💥", error);
    logger.error("Name Check Server Error:", error); 
  } 
})
 
// 계정생성
router.post('/create',  (req, res) => {   
  const { user_id, account_name, account_profile } = req.body;  
  const values = [user_id, account_name, account_profile]
  try {
    pool.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(sql.setAccountCreate, values, function(error, results) {
        if (error) throw error; 
        if (results) {
          return res.send({ code: 200, results:results, message: 'Account Create is successfully' });
        } else {
          return res.send({ code: 401, message: 'Account Create is failed' });
        }
      });
    })
  }catch(error){
    logger.info("Account Create Server Error💥", error);
    logger.error("Account Create Server Error:", error); 
  } 
})

// 계정 삭제
router.delete('/delete', (req, res) => { 
  const { user_id, account_name } = req.headers  
 
  try {
    pool.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(sql.accountDelete, [user_id, account_name], function(error, results) {
        if (error) throw error;  
        if (results) {
          return res.send({ code: 200, message: 'Account Delete Create is successfully' });
        } else {
          return res.send({ code: 401, message: 'Account Delete Create is failed' });
        }
      });
    })
  }catch(error){
    logger.info("Account Delete Create Server Error💥", error);
    logger.error("Account Delete Create Server Error:", error); 
  } 
})

export default router