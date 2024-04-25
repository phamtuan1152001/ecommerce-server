const config = require("../../config/AuthConfig");
const db = require("../../app/models");
const User = db.user;
const Role = db.role;
const UserInfo = require("../models/User")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// set up send email
var nodemailer = require("nodemailer");
const USER_NAME_GMAIL = "petshopecommerce301@gmail.com";
const APP_PASSWORD_HARD_CODE = "oelntfgcqbaypmrg";

class AuthController {
  async signup(req, res, next) {
    const sendEmailActive = (code, userMail) => {
      // console.log("code", code);
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: USER_NAME_GMAIL,
          pass: APP_PASSWORD_HARD_CODE,
        },
      });

      var mailOptions = {
        from: "petshopecommerce301@gmail.com",
        to: userMail,
        subject: "Code Active Account",
        text: `Your code active account is ${code}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error", error);
          // res.send({
          //   retCode: 0,
          //   retText: "Send email unsuccessfully!",
          //   retData: null,
          // });
          return;
        } else {
          // res.send({
          //   retCode: 0,
          //   retText: "Send email successfully!",
          //   retData: null,
          // });
          // console.log("info", info);
          return;
        }
      });
    };

    const isUsernameExist = await UserInfo.findOne({
      username: req.body.username
    }).exec()
    const isEmailExist = await UserInfo.findOne({
      email: req.body.email
    }).exec()
    // const isPhoneExist = await UserInfo.findOne({
    //   phone: req.body.phone
    // })
    if (
      !!isUsernameExist ||
      !!isEmailExist
    ) {
      res.status(409).send({
        retCode: 3,
        retData: {},
        retText: `Failed! Your ${!!isUsernameExist ? "username" : "email"} is already in use!`
      })
      return
    } else {
      const { username, password, fullName, phone, statusActive, email } =
        req.body || {};
      const codeActive = Math.floor(Math.random() * 900000) + 100000;

      const userSave = new User({
        username: username,
        password: bcrypt.hashSync(password, 8),
        fullName,
        phone,
        email,
        codeActive,
        statusActive, // 0 is not active, 1 is active
        refreshToken: ""
      });

      userSave.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (req.body.roles) {
          Role.find(
            {
              name: { $in: req.body.roles },
            },
            (err, roles) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              user.roles = roles.map((role) => role._id);
              user.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }

                // Send email
                sendEmailActive(codeActive, email);

                res.send({
                  retCode: 0,
                  retText: "User was registered successfully!",
                  retData: {
                    userId: user._id,
                  },
                });
              });
            }
          );
        } else {
          Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              // Send email
              // sendEmailActive(codeActive, username);

              res.send({
                retCode: 0,
                retText: "User was registered successfully!",
                retData: {
                  userId: user._id,
                },
              });
            });
          });
        }
      });
    }
  }

  signin(req, res, next) {
    const sendEmailActive = (code, userMail) => {
      // console.log("code", code);
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: USER_NAME_GMAIL,
          pass: APP_PASSWORD_HARD_CODE,
        },
      });

      var mailOptions = {
        from: "petshopecommerce301@gmail.com",
        to: userMail,
        subject: "Code Active Account",
        text: `Your code active account is ${code}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error", error);
          // res.send({
          //   retCode: 0,
          //   retText: "Send email unsuccessfully!",
          //   retData: null,
          // });
          return;
        } else {
          // res.send({
          //   retCode: 0,
          //   retText: "Send email successfully!",
          //   retData: null,
          // });
          // console.log("info", info);
          return;
        }
      });
    };

    User.findOne({
      username: req.body.username,
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!user) {
          return res.status(404).send({
            retCode: 1,
            retData: {},
            retText: "User Not found."
          });
        } else {
          if (user.statusActive === 0) {
            sendEmailActive(user.codeActive, user.email);
            res.json({
              retCode: 1,
              retText: "Account is not actived",
              retData: {
                email: user.email,
                userId: user._id
              },
            });
          } else {
            var passwordIsValid = bcrypt.compareSync(
              req.body.password,
              user.password
            );

            if (!passwordIsValid) {
              return res.status(401).send({
                accessToken: null,
                retText: "Invalid Password!",
              });
            }

            var accessToken = jwt.sign({ id: user.id }, config.accessTokenSecret, {
              // expiresIn: 86400, // 24 hours
              expiresIn: /* 300 */ /* 1800 */ 86400, // 30 mins - 1hours
            });

            var refreshToken = jwt.sign(
              { id: user.id },
              config.refreshTokenSecret,
              {
                expiresIn: 2629440, // 1 month
              }
            );

            /* Update refresh token of user in db */
            User.updateOne(
              {
                _id: user.id
              },
              {
                $set: {
                  "refreshToken": refreshToken
                }
              }
            ).exec((err, result) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              // console.log("re", result)
              var authorities = [];

              for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
              }

              /* Assignning cookie */
              // res.cookie('accessToken', accessToken, { httpOnly: true });
              /*  */

              res.status(200).send({
                retCode: 0,
                retText: "Login successfully!",
                retData: {
                  id: user._id,
                  username: user.username,
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  statusActive: user.statusActive,
                  roles: authorities,
                },
              });
            })
            /*  */
          }
        }
      });
  }

  async confirmActiveCode(req, res, next) {
    const { code, userId } = req.body || {};

    const userDetail = await User.findOne({ _id: userId }).exec();
    if (!!userDetail) {
      if (userDetail.codeActive === code) {
        userDetail.set({ statusActive: 1 });
        await userDetail.save();
        res.json({
          retCode: 0,
          retText: "Successfully active account",
          retData: null,
        });
      } else {
        res.status(400).send({ message: "Code active is not correct!" });
        return;
      }
    } else {
      res.status(400).send({ message: "User not found!" });
      return;
    }
    // res.json(userDetail);

    // User.findOne({ _id: userId }).exec(async (err, user) => {
    //   if (err) {
    //     res.status(500).send({ message: err });
    //     return;
    //   } else {
    //     if (user) {
    //       if (user.codeActive === code) {
    //         user.set({ statusActive: 1 });
    //         await user.save();
    //         res.json({
    //           retCode: 0,
    //           retText: "Successfully active account",
    //           retData: null,
    //         });
    //       } else {
    //       }
    //     } else {
    //       res.status(400).send({ message: "User not found!" });
    //       return;
    //     }
    //   }
    // });
  }

  verifyAccessToken(req, res, next) {
    const token = req.body.accessToken
    if (!token) {
      return res.status(402).send({
        retCode: 1,
        retText: "No access token provided",
        retData: {}
      });
    } else {
      jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            retCode: 1,
            retText: "Access token is expired",
            retData: {}
          });
        }
        User.findOne({
          _id: decoded.id
        }).populate("roles", "-__v")
          .exec((err, user) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            const { password, ...rest } = user || {}

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
              authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            res.json({
              retCode: 0,
              retText: "Confirm verify",
              retData: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                accessToken: token,
                refreshToken: user.refreshToken,
                statusActive: user.statusActive,
                roles: authorities,
              }
            })
          })
      });
    }
  }

  generateAccessToken(req, res, next) {
    const refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, config.refreshTokenSecret, (err, decoded) => {

      if (err) {
        return res.status(401).send({
          retCode: 1,
          retText: "Refresh token is expired",
          retData: {}
        });
      }
      // console.log("dec", decoded)

      var accessToken = jwt.sign({ id: decoded.id }, config.accessTokenSecret, {
        // expiresIn: 86400, // 24 hours
        expiresIn: /* 300 */ 1800, // 30 mins
      });

      var refreshToken = jwt.sign(
        { id: decoded.id },
        config.refreshTokenSecret,
        {
          expiresIn: 2629440, // 1 month
        }
      );

      User.updateOne(
        {
          _id: decoded.id
        },
        {
          $set: {
            "refreshToken": refreshToken
          }
        }
      ).exec(async (err, result) => {

        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        User.findById(decoded.id)
          .populate("roles", "-__v")
          .exec((errUser, resultUser) => {
            if (errUser) {
              res.status(500).send({ message: "User not found" });
              return;
            }
            // console.log("resultUser", resultUser)
            const user = resultUser

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
              authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            res.status(200).send({
              retCode: 0,
              retText: "Generate access token successfully!",
              retData: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                accessToken: accessToken,
                refreshToken: refreshToken,
                statusActive: user.statusActive,
                roles: authorities,
              },
            });
          })
      })
    })
  }

  sendCode(req, res, next) {
    const sendEmailActive = (code, userMail) => {
      // console.log("code", code);
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: USER_NAME_GMAIL,
          pass: APP_PASSWORD_HARD_CODE,
        },
      });

      var mailOptions = {
        from: "petshopecommerce301@gmail.com",
        to: userMail,
        subject: "Code Active Account",
        text: `Your code active account is ${code}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error", error);
          // res.send({
          //   retCode: 0,
          //   retText: "Send email unsuccessfully!",
          //   retData: null,
          // });
          return;
        } else {
          // res.send({
          //   retCode: 0,
          //   retText: "Send email successfully!",
          //   retData: null,
          // });
          // console.log("info", info);
          return;
        }
      });
    };

    const { email } = req.body || {}
    const codeActive = Math.floor(Math.random() * 900000) + 100000;

    const generateCode = () => {
      return Math.floor(Math.random() * 900000) + 100000
    }

    User.findOne({ email: email }).exec((err, user) => {
      if (!user) {
        res.status(400).send({
          retCode: 1,
          retText: "User not found",
          retData: null
        });
        return;
      }
      // console.log("codeActive", codeActive)

      User.updateOne(
        { "_id": user._id },
        {
          $set: {
            "codeActive": codeActive === user.codeActive ? generateCode() : codeActive
          }
        }
      ).exec((error, update) => {
        if (error) {
          res.status(500).send({ message: err });
          return;
        }
        sendEmailActive(codeActive === user.codeActive ? generateCode() : codeActive, email)
        res.json({
          retCode: 0,
          retText: "Send code for reset password successfully",
          retData: {
            userId: user._id,
          }
        })
      })
    })

  }

  resetPassword(req, res, next) {
    const { userId, code, newPassword } = req.body || {}

    User.findOne({ "_id": userId }).exec((err, user) => {
      if (!user) {
        res.status(400).send({
          retCode: 1,
          retText: "User not found",
          retData: null
        });
        return;
      }

      if (user.codeActive === code) {
        User.updateOne(
          { "_id": userId },
          {
            $set: {
              "password": bcrypt.hashSync(newPassword, 8)
            }
          }
        ).exec((error, password) => {
          if (error) {
            res.status(500).send({ message: err });
            return;
          }

          res.json({
            retCode: 0,
            retText: "Reset password successfully!",
            retData: password
          })
        })
      } else {
        res.status(400).send({ message: "Code active is not correct!" });
        return;
      }
    })
  }

  deleteCodeActive(req, res, next) {
    const { userId } = req.body || {}

    User.findOne({ "_id": userId }).exec((err, user) => {
      if (!user) {
        res.status(400).send({
          retCode: 1,
          retText: "User not found",
          retData: null
        });
        return;
      }

      // res.json(user)
      User.updateOne(
        { "_id": user._id },
        {
          $set: {
            "codeActive": 0
          }
        }
      ).exec((err, update) => {
        if (err) {
          res.status(500).json({ message: err })
          return
        }

        res.json({
          retCode: 0,
          retText: "Delete code active successfully",
          retData: null
        })
      })
    })
  }
}

module.exports = new AuthController();
