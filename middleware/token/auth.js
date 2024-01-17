import Dotenv from 'dotenv';
Dotenv.config();
import express from 'express'; 
import jwt from 'jsonwebtoken';
import { generateAccessToken } from './createtoken.js';

const router = express.Router();

router.post('/', (req, res) => { 
  const accessToken = req.body.token;    
  const refreshToken = req.cookies.user;    

  if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: 'Access token not provided' });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
          console.log('Access Token has expired');  
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
            if(err) {
              if(err.name === 'TokenExpiredError') {
                res.clearCookie('user')
                res.redirect('/');
                console.log('Refresh Token has expired');  
              }else {
                return res.json({ code: 401, message: '유효하지 않은 Refresh 토큰입니다.'})
            }
            }else{ 
              // Refresh 토큰 재발급
              const user = {
                isAuth: true,
                user_id: decoded.user_id,
                role: decoded.role
              } 
              const reAccessToken = generateAccessToken(user) 
              return res.send({
                code: 'New Token',
                message: '토큰이 재발급 되었습니다.',
                token: reAccessToken
              }) 
            }
          }) 
      }else {
          return res.json({ code: 401, message: '유효하지 않은 Access 토큰입니다.'})
      }
    } else { 
        req.user = decoded; 
    } 
  });   
});

export default router