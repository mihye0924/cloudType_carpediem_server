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
  // console.log(req,"req")
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
  console.log(imagelist,"imagelist")
  return res.json({ success: true, imagePath: imagelist });
});  

 
// 내 정보 - 사진 데이터 
router.get('/', (req, res) => { 
  const { account_name } = req.headers;  
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.getMyList, [account_name], function (error, results){
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

// 내 정보 - 프로필 데이터 
router.get('/profile/:name', (req, res) => { 
  const account_name = req.params.name;   
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.getMyProfile, [account_name], function (error, results){
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