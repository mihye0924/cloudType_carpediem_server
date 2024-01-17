import Dotenv from 'dotenv';
Dotenv.config();
import path from 'path'; 
import cors from 'cors';
import express from 'express';  
import bodyParser from 'body-parser'; 
import cookieParser from 'cookie-parser'; 
import auth from './middleware/token/auth.js';  
import upload from './routes/upload.js';   
import user from './routes/user.js';        
import list from './routes/list.js';   
import account from './routes/account.js';  

const port = normalizePort(process.env.PORT || '3000');
const app = express();  
const __dirname = path.resolve(); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: '*', 
    credentials: true, // 크로스 도메인 허용 
})); 
app.use('/', express.static(path.join(__dirname, 'dist'))); 
app.use(bodyParser.json({ limit:'50mb' }));


// middleware 경로
app.use('/auth', auth);  
app.use('/upload', upload);  


// post, get, put, delete 경로
app.use('/user', user);   
app.use('/account', account);   
app.use('/list', list);    


app.get('/', (req, res) => { 
    res.send('server connection'); 
}); 
app.listen(port, () => { 
    console.log(`server is listening at localhost:${process.env.PORT}`); 
}); 
