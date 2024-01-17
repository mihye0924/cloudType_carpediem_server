import app from '../app.js'; 
import http from 'http'; 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
 
const server = http.createServer(app);  
  
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port); 

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
 