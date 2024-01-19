import Dotenv from 'dotenv';
Dotenv.config();
import path from 'path';  
import express from 'express'; 
import mysql from 'mysql2';
import { connection } from  '../lib/db.js';
import { sql } from  '../lib/sql.js';
import multer from 'multer';
import logger from '../middleware/config/logger.js';
 
const __dirname = path.resolve(); 
const router = express.Router();
const pool = mysql.createPool(connection); 

const upload = multer({
  storage: multer.diskStorage({ 
      destination(req, file, cb) { // 저장 위치
          cb(null, path.join(__dirname, "public/uploads/list")); 
      },
      filename: (req, file, cb) => {	
        cb(null, file.originalname)
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
});

// 내 정보 - 이미지 업로드
router.post('/upload', upload.array('list'), (req, res) => { 
  if (!req.files) {
    return res.status(400).json({ error: '이미지를 업로드해주세요.' });
  }  
  const imagelist = [];
  for(let i = 0; i < req.files.length; i++) {
    imagelist.push({
      id: i+1,
      img: req.files[i].filename
    })
  } 
  return res.json({ success: true, imagePath: imagelist });
});  

// 내 정보 - 리스트
router.get('/:name', (req, res, next) => { 
  const account_name = req.params.name;    
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listData, [account_name], function (error, results) { 
        if (error) throw error;
        if (results.length > 0) {
          next();
          return res.send({ code: 200, result: results, message: 'List Profile is successfully' });
        } else {
          return res.send({ code: 401, message: 'List Profile is failed' });
        }
      })
    })
  }catch(error){
    logger.info("List Profile Server Error💥", error);
    logger.error("List Profile Server Error:", error);
  } 
})
 

// 내 정보 - 사진, 이름, 소개, 링크 등등
router.get('/profile/:name', (req, res, next) => { 
  const account_name = req.params.name;    
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listProfile, [account_name], function (error, results){ 
        if(error) throw error;       
        if(results.length > 0){ 
          next()
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
 
// 글쓰기 
router.post('/create', (req, res) => {
  const {account_name, list_image, list_content} = req.body;  
  const values = [account_name, list_image, list_content]

  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listCreate, values, function (error, results){ 
        // console.log(results,"rer") 
        if(error) throw error;     
        if(results){ 
          return res.send({ code: 200, result: results, message: 'List Write is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Write is failed'})
        }
      })
    })
  }catch(error){
    logger.info("List Write Server Error💥", error);
    logger.error("List Write Server Error:", error);
  } 
})

export default router;