var express = require('express');
var mongoose = require('mongoose');
// var bodyParser = require('body-parser');
var config = require ('./config');

var app = express();
app.use(express.static('public'));

app.get('/', function(req, res){
    // if (auth??){
    //     json({access: true, data: data})
    // } else {
    //     json({access: false})
    // }
    console.log(req.isAuthenticated(), 'auth');
    res.json({})
});

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
       if (err && callback) {
           return callback(err);
       }

       app.listen(config.PORT, function() {
            console.log('Listening on localhost', config.PORT);
            if(callback) {
               callback();
            }
       });
    });    
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

exports.app = app;
exports.runServer = runServer;