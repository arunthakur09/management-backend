// This is session based auth
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , session = require('express-session')
    , usersModel = require('../models/users')
    , passwordHash = require('password-hash');
//, logger = require('../models/logger.js');
// setup passport
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (userId, done) {
    var data = {
        id: userId,
        role: '',
        isActive: '1',
        email: ''
    };
    var result = usersModel.getUsers(data).done(function (result) {
        // done(null, result[0][0]);
        done(null, result[0]);
    }, function (err) {
        done(err);
    });
});

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

        usersModel.getUsers(data).then(function (user) {
            // user = user[0];
            if (user.length == 0)
                return done(null, false, { message: 'Incorrect email or password.' });
            else {
                user = user[0];
                if (passwordHash.verify(password, user.password)) {
                    // if(password === user.password){
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Incorrect email or password .' });
                }
            }
        }, function (err) {
            return done(err);
        });
    }
));

module.exports = {
    // for wich I need an app
    setup: function (app, router) {
        // setup express
        app.use(session({ secret: config.passportSecret, rolling: true, resave: true, saveUninitialized: true, cookie: { maxAge: 1800000 } })); // 30min max age
        app.use(passport.initialize());
        app.use(passport.session());

        // configure routes
        router.post("/login", function (req, res, next) {
            passport.authenticate("local", function (err, user, info) {
                if (err) {
                    console.log(err);
                    next(err);
                }
                else if (user) {
                    if (req.body.remember_me) {
                        req.session.cookie.maxAge = config.sessionMaxAge;
                    }
                    req.login(user, function (err) {
                        if (err)
                            next(err);
                        else {
                            //logger.addActivityLog({userId : user.id , activity : appResource.activity.SIGNED_IN});
                            res.status(200);
                            user.password = null;
                            res.send({ result: "success", user: user });
                        }
                    });
                }
                else {
                    res.status(401);
                    res.send({ result: info });
                    //res.redirect('/login' + appendage );
                }
            })(req, res, next);
        });
        router.get("/logout", function (req, res) {
            req.logout();
            res.redirect("/");
        });
        router.get("/checkAccess/:c", function (req, res, next) {
            if (req.isAuthenticated()) {
                if (req.params.c == "maintenance") {
                    res.status(200);
                    //res.send("authorized");
                    res.json({ result: "authorized", data: {} });
                }
                else if (module.exports.checkPageAccess(req)) {
                    if (!config.underMaintenance || req.user.isAdmin) {
                        res.status(200);
                        //res.send("authorized");
                        res.json({ result: "authorized", data: {} });
                    }
                    else {
                        res.status(307);
                        res.send("undermaintenance");
                    }
                }
                else {
                    res.status(401);
                    res.send("unauthorized");
                }
            }
            else {
                res.status(401);
                res.send("unauthorized");
            }
        });
    },

    // add middleware for other usage
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            var isAuthorized = false;
            if (module.exports.isAuthorized(req))
                return next();
            else {
                res.status(401);
                res.send("unauthorized");
            }
        }
        else {
            res.status(401);
            res.send("unauthorized");
        }
    },
    isAuthorized: function (req) {
        console.log("isAuthorized------------->", req);
        var authorized = false;
        if (req.user.roleId == 1) authorized = true;
        // if(req.url){
        //     var roles = req.user.roles.split(',');
        //     for (var i = 0; i < roles.length; i++) {
        //         for (var j=0;j < access.api[roles[i]].length; j++){
        //             if(req.url.indexOf(access.api[roles[i]][j]) == 0)
        //             {
        //                 authorized = true;
        //                 break;
        //             }
        //         }
        //         if(authorized) break;
        //     }
        // }

        return authorized;
    },
    checkPageAccess: function (req) {
        // var authorized = false;
        // if(req.params.c){
        //     var roles = req.user.roles.split(',');
        //     for (var i = 0; i < roles.length; i++) {
        //         if(access.route[roles[i]].indexOf(req.params.c) > -1)
        //         {
        //             authorized = true;
        //             break;
        //         }
        //     }
        // }

        // return authorized;
        return true;
    }
}