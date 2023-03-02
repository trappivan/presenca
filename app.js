// https://www.youtube.com/watch?v=gQYsUjT-IBo&ab_channel=AdamThomas


var SerialPort = require("serialport");
var http = require('http');
var fs = require('fs');

var index = fs.readFileSync('index.html');
var path = require('path');
var dir = path.join(__dirname, 'img');
var mime = {
    svg: 'image/svg+xml',
    html: 'text/html',
    js: 'text/javascript'
};
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimeter: '\r\n'
});

var port1 = new SerialPort('COM7',{
    baudRate: 9600,
    dataBits:8,
    parity:'none',
    stopBits :1,
    flowControl: false
});



port1.pipe(parser);


var app = http.createServer(function(req,res){
    
    var file = path.join(dir, req.url);
    if(req.url == "/index.html" || req.url == "/" || req.url == ""){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(index);
    }else{
        try {
            if (fs.existsSync(file)) {
                var type = mime[path.extname(file).slice(1)] || 'text/plain';
                console.log(file);
                var s = fs.createReadStream(file);
                s.on('open', function () {
                    res.setHeader('Content-Type', type);
                    s.pipe(res);
                });
            }else{
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(file);
            }
        } catch (error) {
            
        }
    }
    
    
    
    
})

var io = require('socket.io').listen(app);

io.on('connection',function(data){

    console.log('Node JS is listening');

})

parser.on('data', function(data){
    console.log(data);
    io.emit('data',data);
});

console.log("Server is running on port 3000");
app.listen(3000);

















