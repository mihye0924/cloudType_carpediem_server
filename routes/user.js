import Dotenv from 'dotenv';
Dotenv.config();
import express from 'express'; 
import mysql from 'mysql2';
import { connection } from  '../lib/db.js'; 
import bcrypt from 'bcryptjs';  
import { generateAccessToken, generateRefreshToken } from '../middleware/token/createtoken.js';
import {sql} from '../lib/sql.js';
import logger from '../middleware/config/logger.js';
// import coolsms from 'coolsms-node-sdk';

const router = express.Router();
const pool = mysql.createPool(connection);  
let num = 0; 

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
              return res.send({
                code: 200,
                message: '토큰이 생성되었습니다.',
                isAuth: user.isAuth,
                user_id: user.user_id, 
                role: user_id !== "admin" ? 0 : 1,
                token: accessToken
              })   
          }else{
            return res.send({ code: 401, message: 'PW is not found'})
          }
        }else{
          return res.send({ code: 401, message: "Login id is not found"})
        }
      }) 
      conn.release();
    })
  }catch(error){
    logger.info("Login Server Error💥", error);
    logger.error("Login Server Error:", error); 
  } 
});
   
// 회원가입 중복찾기
router.get('/:id', (req, res) => {   
  const user_id = req.params.id;   

  try {
    pool.getConnection(function(err, conn){
      if(err) throw err;
      conn.query(sql.JoinIdCheck, [user_id], function(error, results) {
        if(error) throw error;    
        if(results.length < 1){
          return res.send({ code: 200, message: 'IdCheck id check successfully'})
        }else{
          return res.send({ code: 401, message: 'IdCheck id check failed' })
        }
      })
      conn.release();
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
          return res.send({ code: 200, message: 'Join is successfully' });
        } else {
          return res.send({ code: 401, message: 'Join is failed' });
        }
      });
      conn.release();
    })
  }catch(error){
    logger.info("Join Server Error💥", error);
    logger.error("Join Server Error:", error); 
  }  
}); 
 

// 로그인 아이디 찾기
router.post('/idFind', (req, res) => {
  const {user_name, user_phone} = req.body;
  // const sms = coolsms.default;
  // const messageService = new sms(process.env.COOL_API_KEY, process.env.COOL_API_SCRECT_KEY)
  
  try {
    pool.getConnection(function(err, conn){
      if(err) throw err;
      const random_number = Math.floor(100000 + Math.random() * 900000); 
      conn.query(sql.loginIdCheck, [user_name, user_phone], async function(error, results) {
        if(error) throw error;  
        if(results.length > 0){ 
          num = random_number 
          console.log(num,"아이디 랜덤번호")
          // messageService.sendOne({
          //   to: "01047755749",
          //   from: user_phone,
          //   text: `[carpediem] 본인확인을 위해 인증번호 ${random_number} 를 입력해주세요.`, 
          // }) 
          return res.send({ code: 200, message: 'certificate successfully'})  
        }else{
          return res.send({ code: 401, message: 'idFind id check failed' })
        }
      })   
      conn.release();
    })
  }catch(error){
    logger.info("idFind Server Error💥", error);
    logger.error("idFind Server Error:", error); 
  } 
})
 
// 로그인 아이디 인증번호 체크
router.post('/idCertificate', (req, res) => {
  const {user_name, certificateNum} = req.body 

  if(Number(certificateNum) === num) { 
  try {   
      pool.getConnection(function(err, conn){
        if(err) throw err;
        conn.query(sql.loginIdCertificateCheck, [user_name], async function(error, results) {
        if(error) throw error; 
        if(results.length > 0){
          return res.send({ code: 200, result: results[0].user_id, message: 'certificate is found' })
        }else{
          return res.send({ code: 401, message: 'certificate is not found' })
        }
      })    
      conn.release();
      }) 
    }catch(error){
      logger.info("certificate Check Server Error💥", error);
      logger.error("certificate Check Server Error:", error); 
    } 
  }
})

// 로그인 비밀번호 찾기 
router.post('/pwFind', (req, res) => {
  const {user_id, user_phone} = req.body;
  // const sms = coolsms.default;
  // const messageService = new sms(process.env.COOL_API_KEY, process.env.COOL_API_SCRECT_KEY)
  
  try {
    pool.getConnection(function(err, conn){
      if(err) throw err;
      const random_number = Math.floor(100000 + Math.random() * 900000); 
      conn.query(sql.loginPwCheck, [user_id, user_phone], async function(error, results) {
        if(error) throw error;  
        if(results.length > 0){ 
          num = random_number 
          console.log(num,"비밀번호 랜덤발송")
          // messageService.sendOne({
          //   to: "01047755749",
          //   from: user_phone,
          //   text: `[carpediem] 본인확인을 위해 인증번호 ${random_number} 를 입력해주세요.`, 
          // }) 
          return res.send({ code: 200, message: 'certificate successfully'})  
        }else{
          return res.send({ code: 401, message: 'idFind id check failed' })
        }
      })   
      conn.release();
    })
  }catch(error){
    logger.info("idFind Server Error💥", error);
    logger.error("idFind Server Error:", error); 
  } 
})

// 로그인 비밀번호 인증번호 체크
router.post('/pwCertificate', (req, res) => {
  const {user_id} = req.body 

 try {
  pool.getConnection(function(err, conn){
    if(err) throw err;
    conn.query(sql.loginPwCertificateCheck, [user_id], async function(error, results) {
      if(error) throw error;   
      if(results.length > 0){  
        return res.send({ code: 200, result:results[0].user_id, message: 'certificate is found' })
      }else{
        return res.send({ code: 401, message: 'certificate is not found' })
      }
    })    
    conn.release();
    })
  }catch(error){
    logger.info("certificate Check Server Error💥", error);
    logger.error("certificate Check Server Error:", error); 
  } 
})

// 비밀번호 찾기 - 수정
router.post('/pwEdit', (req, res) => {
  const {user_id, user_pw} = req.body; 
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(user_pw, salt); 

  try {
    pool.getConnection(function(err, conn){
    if(err) throw err;
    conn.query(sql.loginPwEdit, [hashPassword, user_id], async function(error, results) {
      if(error) throw error;  
      if(results){   
        return res.send({ code: 200, message: 'certificate is found' })
      }else{
        return res.send({ code: 401, message: 'certificate is not found' })
      }
    })    
    conn.release();
    })
  }catch(error){
    logger.info("certificate Check Server Error💥", error);
    logger.error("certificate Check Server Error:", error); 
  } 
})

// 로그아웃
router.post('/logout', (req, res) => {  
  res.clearCookie('user', { path: '/' });
  res.send({ code: 200, message: 'Successfully logged out'}) 
})

export default router;