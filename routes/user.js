import Dotenv from 'dotenv';
Dotenv.config();
import express from 'express'; 
import mysql from 'mysql2';
import { connection } from  '../lib/db.js'; 
import bcrypt from 'bcryptjs';  
import { generateAccessToken, generateRefreshToken } from '../middleware/token/createtoken.js';
import {sql} from '../lib/sql.js';
import logger from '../middleware/config/logger.js';

const router = express.Router();
const pool = mysql.createPool(connection); 

// 로그인
router.post('/login', (req, res) => {    
  const {user_id, user_pw} = req.body;  

  const user = { 
    isAuth: true,
    user_id: user_id,
    role: user_id !== "admin" ? 0 : 1,
  }   
   try {
    pool.getConnection(function(err, conn){
      if(err) throw err;
      conn.query(sql.login, [user_id], function(error, results) { 
        if(error) throw error;    
         
        if(results.length > 0 && results[0].user_id) {  
          const pwCheck = bcrypt.compareSync(user_pw, results[0].user_pw);  
          if(pwCheck){  
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user); 
            
              res.cookie('user', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
    
              res.send({
                code: 200,
                message: '토큰이 생성되었습니다.',
                isAuth: user.isAuth,
                user_id: user.user_id, 
                role: user_id !== "admin" ? 0 : 1,
                token: accessToken
              })   
          }else{
            return res.send({ code: 401, message: 'pw is not found'})
          }
        }else{
          return res.send({ code: 401, message: "login id is not found"})
        }
      }) 
    })
  }catch(error){
    logger.info("Login Server Error💥", error);
    logger.error("Login Server Error:", error); 
  } 
});
   
// 아이디 중복찾기
router.get('/idCheck', (req, res) => {   
  const {user_id} = req.body;   

  try {
    pool.getConnection(function(err, conn){
      if(err) throw err;
      conn.query(sql.findId, [user_id], function(error, results) {
        if(error) throw error;  
        console.log(results.length)  
        if(results.length < 1){
          return res.send({ code: 200, message: 'jogin id check successfully'})
        }else{
          return res.send({ code: 401, message: 'join id check failed' })
        }
      })
    })
  }catch(error){
    logger.info("IdCheck Server Error💥", error);
    logger.error("IdCheck Server Error:", error); 
  } 
});

// 회원가입
router.post('/join', (req, res) => {  
  const {user_id, user_pw, user_name, user_birth, user_phone, user_email, role} = req.body
   
  // 비밀번호 암호화하기
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(user_pw, salt);
  const values = [user_id, hashPassword, user_name, user_birth, user_phone, user_email, role];
  try {
    pool.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(sql.join, values, function (error, results) { 
        if (error) throw error;
        if (results) {
          return res.send({ code: 200, message: 'join is successfully' });
        } else {
          return res.send({ code: 401, message: 'join is failed' });
        }
      });
    })
  }catch(error){
    logger.info("Join Server Error💥", error);
    logger.error("Join Server Error:", error); 
  }  
}); 



export default router;