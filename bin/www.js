import app from '../app.js'; 
import http from 'http'; 
const port = process.env.PORT || '3000';
app.set('port', port);
 
const server = http.createServer(app); 
server.listen(port);
 