const express = require('express');
const User = require('../models/user');
const passport = require('passport'); // 

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//Signup 

router.post('/signup', (req, res) => {
    User.register( // a passport method
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
});

//Login

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

//Logout

router.get('/logout', (req, res, next) => {
    if (req.session) {
      req.session.destroy(); // deleting the session file on server side
      res.clearCookie('session-id'); // clearing the cookie with session id stored in it on client side 
      res.redirect('/'); //localhost/3000/
    } else {
      const err = new Error('You are not logged in!');
      err.status = 403;
      return next(err);
    }
});

module.exports = router;
