var app = require('./user-auth').sessionApp;
var isAuthenticated = require('./user-auth').isAuthenticated;
var Item = require('./models/user-data');

var userData = {userData: true};

app.get('/authenticate',  isAuthenticated, function(req, res){
    if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: 'user needs to login'
        });
    } else {
        return res.status(200).json({
          success: true,
          userData: userData
        });
    }
});

app.get('/API/items', isAuthenticated, function(req, res) {
    Item.find({user_id: req.user._id}, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        var temp = items;
        for (var item in temp) {
          temp[item].user_id = null;
        }
        res.json(temp);
    });
});

app.post('/API/items', isAuthenticated, function(req, res) {
    Item.create({
        user_id: req.user._id,
        name: req.body.name,
        checked: false
    }, function(err, item) {
        if (err) {
            return res.status(400).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json({
          _id: item._id,
          name: item.name
        });
    });
});

app.put('/API/items/:id', isAuthenticated, function(req, res) {
    if (!req.body.check) {
        Item.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {name: req.body.name}
        }, {
            upsert: true
        }, function(err, item) {
            if (err) {
                return res.status(400).json({
                    message: 'Internal Server Error'
                });
            }
            res.status(200).json(item);
        });
    } else {
        Item.findOne({_id: req.params.id}, function(err, item) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if(!item) {
                    return res.status(400).json({
                    message: 'Internal Server Error'
                });
            }
            
            if (item.checked) {
                Item.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $set: {checked: false}
                }, {
                    upsert: true
                }, function(err, item) {
                    if (err) {
                        return res.status(400).json({
                            message: 'Internal Server Error'
                        });
                    }
                    res.status(200).json(item);
                });
            } else {
                Item.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $set: {checked: true}
                }, {
                    upsert: true
                }, function(err, item) {
                    if (err) {
                        return res.status(400).json({
                            message: 'Internal Server Error'
                        });
                    }
                    res.status(200).json(item);
                });
            }

        });
    }
});

app.delete('/API/items/:id', isAuthenticated, function(req, res) {
    Item.remove({
        _id: req.params.id
    }, function(err, item) {
        if(err) {
            return res.status(400).json({
                message: 'Internal Server Error '
            });
        }
        res.status(200).json(item);
    });
});

app.delete('/API/items', isAuthenticated, function(req, res) {
    return res.status(400).json({
        message: 'Internal Server Error'
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});