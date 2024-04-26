const jwt = require("jsonwebtoken");
const config = require("../../config/AuthConfig");
const db = require("../../app/models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  // console.log("token", token);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  // console.log("req", req.body);
  User.findById(req.body.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: "err haha" });
      return;
    }
    // console.log("user", user);
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isAdminToken = (req, res, next) => {
  const tokenAuthorization = req.headers.authorization
  if (!tokenAuthorization) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(tokenAuthorization, config.accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    } else {
      User.findById(req.body.userId).exec((err, user) => {
        if (err) {
          res.status(500).send({
            message: "You are not Admin"
          });
          return;
        }

        if (!user) {
          res.status(403).json({
            retCode: 3,
            retText: "Forbidden",
            retData: null
          })
          return
        }

        Role.find(
          {
            _id: { $in: user.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "admin") {
                req.userId = decoded.id;
                next();
                return;
              }
            }

            res.status(403).send({ message: "Require Admin Role!" });
            return;
          }
        );
      });
    }
  });
}

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isAdminToken
};
module.exports = authJwt;
