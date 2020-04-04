const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const FacebookTokenStrategy = require('passport-facebook-token');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; // will provide several methods; one of them will be used to extract a token from req object
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); //returns a token; expires in 1 hour
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // specifies how json web token should be extracted from incoming req object; from authorization header in this case
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => { // searches the collection of users for the id in the token 
                if (err) {
                    return done(err, false); //error and no user found
                } else if (user) {
                    return done(null, user); // no error, user found; passport will use this done callback to acces user document to loaad data from it to req object
                } else {
                    return done(null, false); //no error, no user found
                }
            });
        }
    )
);



exports.verifyUser = passport.authenticate('jwt', {session: false}); // 'jwt' is the strategy here; no sessions used


exports.local = passport.use(new LocalStrategy(User.authenticate()));// User.authenticate() verifies the req username and password against usernames and passwords in the database
passport.serializeUser(User.serializeUser()); // converts user data from req object to be able to be stored
passport.deserializeUser(User.deserializeUser());


exports.verifyAdmin = (req, res, next) => {
    
    if (req.user.admin){  
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403 ;
        return next(err);
    }

};

// see documentation on: https://www.npmjs.com/package/passport-facebook-token  (Configure Strategy)

exports.facebookPassport = passport.use(
    new FacebookTokenStrategy(

        {    
            clientID: config.facebook.clientId,     //const config = require('./config.js');
            clientSecret: config.facebook.clientSecret
        }, 
        (accessToken, refreshToken, profile, done) => {
            User.findOne({facebookId: profile.id}, (err, user) => {  //profile.id received from Facebook; checking if user exists in the database (users collection), if not - creates new user from FB profile data
                if (err) {
                    return done(err, false);
                }
                if (!err && user) { //user exist in mongoDB database
                    return done(null, user);
                } else { // new user
                    user = new User({ username: profile.displayName }); //profile.displayName received from Facebook
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
);



