var passport = require('passport');
// var BasicStrategy = require('passport-http').BasicStrategy;
var server = require('./server');
var bodyParser = require('body-parser');
var User = require('./models/user-model').User;
var LocalStrategy = require('passport-local').Strategy;
// var UserData = require('./models/user-data');
var bcrypt = require('bcryptjs');
var session = require('express-session');

var app = server.app;
// var jsonParser = bodyParser.json();
app.use(bodyParser.json());

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    User.findById(username, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      
        if (err) { 
            return done(err); 
        }
        
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        
        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return done(err);
            }
        
            if (!isValid) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }  
        });
    
        return done(null, user);
    });
  }
));
app.use(session({secret: "fasfa7946sfadf46", resave: false, saveUninitialized:true}));
app.use(passport.session());



// var isAuthenticated = function (req, res, next) { 
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
    
//         return res.status(401).send({
//             success: false, msg: 'User needs to re-authenticated'
//         });
//     }
// };


app.get('/API/home/:username', function(req, res, next) {
  console.log(req);
  if (req.isAuthenticated()) {
      console.log('req user', req.user);
      res.json({
          message: req.params.username + '\'s data'
      });
  } else {
      return res.status(401).send({
        success: false, msg: 'User needs to re-authenticated'
    });
  }
});

app.post('/hidden', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
       
        if (!user) {
            return res.send({
                success: false,
                authenticated: false,
                msg: info.message,
                redirect: false
            });
        }

        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            user.password = '';
            console.log('response object', res);
            // console.log(req.session, 'session')
            return res.status(200).json({
                success: true,
                authenticated: true,
                user: {
                    _id: user.username
                }
            });
            //  return res.redirect('/' + user.username);
        });

    })(req, res, next);
});

app.post('/users', function(req, res) {
    if(!req.body) {
        return res.status(400).json({
            message: 'No request body'
        });
    }
    
    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }
    
    var username = req.body.username;
    
    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }
    
    username = username.trim();
    
    if (username === '') {
        return res.status(422).json({
            messaage: 'Incorrect field length: username'
        });
    }
    
    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }
    
    var password = req.body.password;
    
    if (typeof password != 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }
    
    password = password.trim();
    
    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }
    
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash
            });
       
            user.save(function(err) {
                if (err) {
                    return res.status(500).json({code: err.code,
                        message: 'Internal server error'
                    });
                }

                return res.status(201).json({});
                
            });
        });
    });
});



app.get('/', function(req, res){
    console.log(req.isAuthenticated(), 'auth');
    res.json({})
});

server.runServer();

// module.exports = isAuthenticated;