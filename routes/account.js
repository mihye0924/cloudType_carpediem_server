import Dotenv from 'dotenv';
Dotenv.config();
import path from 'path';  
import express from 'express'; 
import mysql from 'mysql2';
import { connection } from  '../lib/db.js'; 
import {sql} from '../lib/sql.js';
import multer from 'multer';
import logger from '../middleware/config/logger.js'; 

const __dirname = path.resolve(); 
const router = express.Router();
const pool = mysql.createPool(connection); 

const upload = multer({
  storage: multer.diskStorage({ 
      destination(req, file, cb) { // 저장 위치
          cb(null, path.join(__dirname, "/public/uploads/profile")); 
      },
      filename: (req, file, cb) => {	
        cb(null, file.originalname)
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
}); 
 
// 계정,메인(프로필편집) - 이미지 업로드
router.post('/upload', upload.single('profile'), (req, res) => { 
  if (!req.file) {
    return res.status(400).json({ error: '이미지를 업로드해주세요.' });
  }  
  return res.json({ success: true, imagePath: req.file.filename });
});  

// 계정 - 찾기
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

// 계정 - 이름 중복 체크
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
 
// 계정 - 생성
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

// 계정 - 삭제
router.delete('/delete', (req, res) => { 
  const { user_id, account_name } = req.headers;
  console.log(user_id,account_name,"fdsfd")
 
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

// 계정 - 편집
router.put('/edit', (req, res) => {
  const { account_profile, account_info, account_link, account_name } = req.body
  const values = [account_profile, account_info, account_link, account_name]
  try {
    pool.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(sql.accoutEdit, values, function(error, results) {
        if (error) throw error;  
        if (results) {
          return res.send({ code: 200, message: 'Account Delete Create is successfully' });
        } else {
          return res.send({ code: 401, message: 'Account Delete Create is failed' });
        }
      });
    })
  }catch(error) {
    logger.info("Account Edit Create Server Error💥", error);
    logger.error("Account Edit Create Server Error:", error); 
  }
})



export default router