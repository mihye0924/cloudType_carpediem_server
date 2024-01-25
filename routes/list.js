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

// 게시글 - 이미지 저장
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
    return res.status(400).send({ error: '이미지를 업로드해주세요.' });
  }  
  const imagelist = [];
  for(let i = 0; i < req.files.length; i++) {
    imagelist.push({
      id: i+1,
      img: req.files[i].filename
    })
  } 
  return res.send({ success: true, imagePath: imagelist });
});  

// 내 정보 - 리스트 가져오기
router.get('/:name', (req, res) => { 
  const account_name = req.params.name;    
  const data = [] 
  try {
    pool.getConnection(function (err, conn) { 
      if(err) throw err;
      conn.query(sql.listData, [account_name], function (error, results) {
        if (error) throw error;
        if (results.length > 0) {    
          
          results.forEach(( item ) => {  
            data.push({
              ...item,
              list_image: JSON.parse(item.list_image)
            })
          })      
          return res.send({ code: 200, result: data, message: 'List Profile is successfully' });
        } else {
          return res.send({ code: 401, message: 'List Profile is failed' });
        }
      })
      conn.release();
    }) 
  }catch(error){
    logger.info("List Profile Server Error💥", error);
    logger.error("List Profile Server Error:", error);
  } 
})
  
// 내 정보 - 프로필 가져오기(사진, 이름, 소개, 링크) 등등
router.get('/profile/:name', (req, res) => { 
  const account_name = req.params.name;    
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listProfile, [account_name], function (error, results){ 
        if(error) throw error;       
        if(results.length > 0){  
          return res.send({ code: 200, result: results, message: 'List Profile is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Profile is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Profile Server Error💥", error);
    logger.error("List Profile Server Error:", error);
  } 
})
 
// 게시글 - 글쓰기 
router.post('/create', (req, res) => {
  const {account_name, list_image, list_content} = req.body;  
  const values = [account_name, list_image, list_content]

  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listCreate, values, function (error, results){ 
        if(error) throw error;     
        if(results){ 
          return res.send({ code: 200, message: 'List Create is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Create is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Create Server Error💥", error);
    logger.error("List Create Server Error:", error);
  } 
})

// 게시글 - 글삭제
router.delete('/:id/:num', (req, res) => { 
  const values = [req.params.id, req.params.num]
  
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listDelete, values, function (error, results){ 
        if(error) throw error;     
        if(results){ 
          return res.send({ code: 200, message: 'List Delete is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Delete is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Delete Server Error💥", error);
    logger.error("List Delete Server Error:", error);
  } 
})

// 글 수정
router.put('/update', (req, res) => { 
  const { account_name, list_no, list_content } = req.body
  const values = [list_content, list_no, account_name]
  
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listUpdate, values, function (error, results){ 
        if(error) throw error;     
        if(results){ 
          return res.send({ code: 200, result: results, message: 'List Delete is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Delete is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Delete Server Error💥", error);
    logger.error("List Delete Server Error:", error);
  } 
})
  
  
// 게시글 - 좋아요 가져오기
router.get('/likes/:id', (req, res) => {
  const account_name = req.params.id;  

  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listLkiesData, [account_name], function (error, results){ 
        if(error) throw error;     
        if(results){  
          return res.send({ code: 200, results: results, message: 'List Good is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Good is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Good Server Error💥", error);
    logger.error("List Good Server Error:", error);
  } 
})

// 게시글 - 좋아요
router.post('/likes', (req, res) => {
  const {list_no, account_name} = req.body
  const values = [account_name, list_no]
  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listLikes, values, function (error, results){ 
        if(error) throw error;     
        if(results){  
          return res.send({ code: 200, message: 'List Good is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Good is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Good Server Error💥", error);
    logger.error("List Good Server Error:", error);
  } 
})

// 게시글 - 좋아요 삭제
router.delete('/likes/:id/:num', (req, res) => { 
  const values = [req.params.id, req.params.num] 

  try {
    pool.getConnection(function (err, conn) {
      if(err) throw err;
      conn.query(sql.listLikesRemove, values, function (error, results){ 
        if(error) throw error;     
        if(results){ 
          return res.send({ code: 200, message: 'List Good Remove is successfully'})
        }else{
          return res.send({ code: 401, message: 'List Good Remove is failed'})
        }
      })
      conn.release();
    })
  }catch(error){
    logger.info("List Good Remove Server Error💥", error);
    logger.error("List Good Remove Server Error:", error);
  } 
})

export default router;