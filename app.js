import Dotenv from 'dotenv';
Dotenv.config();
import path from 'path'; 
import cors from 'cors';
import express from 'express';  
import bodyParser from 'body-parser'; 
import cookieParser from 'cookie-parser'; 
import auth from './middleware/token/auth.js';    
import user from './routes/user.js';        
import list from './routes/list.js';   
import account from './routes/account.js';  
import index from './routes/index.js';  
 
const app = express();   
const __dirname = path.resolve(); 

app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: '*', 
    credentials: true, // 크로스 도메인 허용 
}));  
app.use(bodyParser.json({ limit:'50mb' }));
app.use(express.static(path.join(__dirname, '/public')));  

// middleware 경로
app.use('/', index);
app.use('/auth', auth);   
 
// post, get, put, delete 경로
app.use('/user', user);   
app.use('/account', account);   
app.use('/list', list);    
 
export default app;
