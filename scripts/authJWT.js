const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./passport");
const usersModel = require("../models/users");

/* POST login. */
module.exports = {
  // for which I need an app
  setup: function (app, router) {
    router.post("/login", function (req, res, next) {
      passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user || user.isActive == 0 || user.isActive == "") {
          return res.status(400).json({
            message: info ? info.message : "Login failed"
            // user   : user
          });
        }
        req.login(user, { session: false }, async err => {
          if (err) {
            res.send(err);
          }
          user.password = null;
          const userPayload = {
            id: user.id,
            roleId: user.roleId,
            guid: user.guid
          };
          const token = await jwt.sign(
            { 
            user: userPayload },
            config.JWT_SECRET,
            { expiresIn: "8h" }
          );
          return res.send({
            result: "success",
            user: userPayload,
            token: token
          });
        });
      })(req, res, next);
    });
  },
  ensureAuth: passport.authenticate("jwt", { session: false }),
  checkAPIAccess: async function (req, res, next) {
    const userPayload = req.user;
    // TODO: This is temporary, make it strong
    // for Admin/System roles
    if (
      userPayload.roleId == 1 ||
      userPayload.roleId == 2

      ) {
      next();
    } else {
      // TODO - Need to change req.route.path to req.url and some logic to make this strong
      const verifyPermissions = await usersModel.verifyUserPermissions({
        userId: userPayload.id,
        requestUrl: req.route.path,
        requestType: req.method.toLowerCase()
      });
      if (verifyPermissions) next();
      else {
        res.status(config.notFound);
        return res.json({ msg: appResource.notFound });
      }
    }
  }
  // ,
  // getTokenFromHeaders: async function (req) {
  //     const authorization = req.headers.authorization;
  //     if (authorization && authorization.split(' ')[0] === 'Bearer') {
  //         return authorization.split(' ')[1];
  //     }
  //     return null;
  // },
  //auth.tokenRequired
  // tokenRequired: async function (req, res, next) {
  //     const getTokenFromHeaders = await module.exports.getTokenFromHeaders(req);
  //     if (getTokenFromHeaders) {
  //         try {
  //             var decoded = jwt.verify(getTokenFromHeaders, config.JWT_SECRET);
  //             req.payload = decoded;
  //             return next();
  //         } catch (err) {
  //             return res.status(401).json({ status: false, data: 'Invalid Auth Token' });
  //         }
  //     } else {
  //         return res.status(401).json({ status: false, data: 'Auth token missing' });
  //     }
  // }
};
