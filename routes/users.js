const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//Signup

router.post('/signup', (req, res, next) => { //allows new user to register on the website
    User.findOne({username: req.body.username}) // checking if the provided in request username is already taken
    .then(user => {
        if (user) {
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else {
            User.create({ // create new user document
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

// Login

router.post('/login', (req, res, next) => { // copied from app.js; 
    if(!req.session.user) { // req.session object properties are automatically filled in based on if req headers contained a cookie with an existing session ID
        const authHeader = req.headers.authorization;

        if (!authHeader) {       // checking for authorization header and keeping on challenging for basic authorization
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
       

        //  authorization header received
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      
        User.findOne({username: username}) // checking the provided in req username and password againt existing documents in users collection
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist!`);
                err.status = 403;
                return next(err);

            } else if (user.password !== password) {
                const err = new Error('Your password is incorrect!');
                err.status = 403;
                return next(err);

            } else if (user.username === username && user.password === password) {
                req.session.user = 'authenticated'; // will be used in app.js: if (req.session.user === 'authenticated') 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));


    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
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
