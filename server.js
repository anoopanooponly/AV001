/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger')
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

//Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//bootstrap passport config
require('./config/passport')(passport);
var io = require('socket.io');
var app = express()
    , server = require('http').createServer(app)
    , io = io.listen(server);

//express settings
require('./config/express')(app, passport, db);
var clients = {};
//Bootstrap routes
require('./config/routes')(app, passport, auth );

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
//app.listen(port);
//var io = require('socket.io').listen(app);
//app.get('/chat', require('./app/controllers/chat').chat);
//io.sockets.on('connection', socket);

io.sockets.on('connection', function (socket) {

    socket.on('add-user', function(data){
        clients[data.username] = {
            "socket": socket.id
        };
    });

    socket.on('private-message', function(data){
        console.log("Sending: " + data.content + " to " + data.username);
        if (clients[data.username]){
            console.log(data);
            io.sockets.socket(clients[data.username].socket).emit("send:message", data);
        } else {
            console.log("User does not exist: " + data.username);
        }
    });


    socket.on('send:message', function (data) {
        if (clients[data.name]){
            console.log("sending chat message: from:" + data.currentuser + " to " + data.name);
            console.log("sending chat message:" + data.message);
            var sendtoUser = data.name;
            data.name = data.currentuser;
            io.sockets.socket(clients[sendtoUser].socket).emit("send:message", data);
        } else {
            console.log("User does not exist: " + data.name);
        }
    });

    socket.on('user:joinforchat', function (data) {
        console.log("new user joined for chat socket.id-->" + socket.id + '---' + data.name);
        clients[data.name] = {
            "socket": socket.id,"name":data.name
        };
        console.log("brodcasting details to all for : socket.id-->" + socket.id + '---' + data.name);
        io.sockets.emit("user:joinforchat", clients);
    });

});

server.listen(port);
console.log('Express app started on port ' + port);

app.get('/chat', function(req, res)
{
    res.jsonp(clients);

});
//Initializing logger
logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;
