const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const usersModel = require('../models/users')
const passwordHash = require('password-hash');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        var data = {
            id: '',
            role: '',
            isActive: '1',
            email: email
        };
        return usersModel.verifyUser(data)
            .then(user => {
                if (user.length == 0) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                } else {
                    if (user[0].isActive == 1) {
                        user = user[0];
                        // Replace passwordHash with Bcrypt
                        if (passwordHash.verify(password, user.password)) {
                            return done(null, user, { message: 'Logged In Successfully' });
                        }
                        else {
                            return done(null, false, { message: 'Incorrect email or password.' });
                        }
                    } else {
                        return done(null, false, { message: 'User is not active' });
                    }
                }
            })
            .catch(err => {
                return cb(err);
            });
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET
},
    function (jwtPayload, cb) {
        return cb(null, jwtPayload.user);
        // if we need to fetch extra info/refreshed info, then this will be useful
        // const jwtPayloadUser = jwtPayload.user;
        // jwtPayloadUser.email = "";
        // jwtPayloadUser.guid = "";
        // return usersModel.getUsers(jwtPayloadUser)
        //     .then(user => {
        //         user[0].password = null;
        //         return cb(null, user[0]);
        //     })
        //     .catch(err => {
        //         return cb(err);
        //     });
    }
));