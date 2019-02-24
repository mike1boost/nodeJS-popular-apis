var app = require('./app');
var http = require('http');



const httpServer = http.createServer(app);

httpServer.listen(4000, () => console.log('Etoro app listening on port 4000!'));