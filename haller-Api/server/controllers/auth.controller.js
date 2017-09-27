import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import emailVerification from '../cronJobs/emailVerification';

const config = require('../../config/env');
const bcrypt = require('bcryptjs');
// var nodemailer = require('nodemailer');
// var randtoken = require('rand-token');
// var token = randtoken.generate(16);
// var rand = Math.random();
// console.log('randtoken', rand.toString(36));
// console.log('randtoken', rand.toString(36).substring(2));
// console.log('randtoken', rand.toString(36).substring(7));
// console.log('randtoken', rand.toString(36).substring(2, 18));
/**
 * /api/auth/:userId/logout
 * Logout user and set the appropriate user status variables
 * returns status code 200 on success otherwise return error message
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function logout(req, res, next) { //eslint-disable-line
  if (req.params.userId) {
    User.get(req.params.userId).then((user) => {
      if (user) {
        const userCpy = user;
        userCpy.status.online = false;
        userCpy.status.activeToken = null;
        userCpy.status.currentStatus = 'offline';
        userCpy.lastOnline = new Date();
        // userCpy.device.updatedAt = new Date();
        userCpy.notifications.deviceToken = '';
        userCpy.save().then(() => res.json({ 'response': httpStatus.OK })).catch(e => next(e));
      }
    });
  } else {
    const error = new APIError('Bad Request -- missing route param', httpStatus.BAD_REQUEST);
    return next(error);
  }
}

function encryptPassword(req, res, next) {
  res.send(bcrypt.hashSync(req.params.password, 10));
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  if (!!req.body.email && !!req.body.password) {
    return User.getByEmail(req.body.email)
      .then((user) => { //eslint-disable-line
        if (user && user.role == 'student') {
          // const token = jwt.sign({
          //   email: user.email
          // }, config.jwtSecret);
          // res.json({
          //   token,
          //   user: user,
          // })
          bcrypt.compare(req.body.password, user.password, (err, same) => { //eslint-disable-line
            if (same) {
              const token = jwt.sign({
                email: user.email
              }, config.jwtSecret);
              const userCpy = user;   // update the user status object to
              userCpy.status.online = true; // reflect their current online status.
              userCpy.status.currentStatus = 'online';
              userCpy.status.activeToken = token;
              userCpy.save().then(updatedUser =>
                res.json({
                  token,
                  user: updatedUser,
                })
              );
            } else {
              const error = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
              return next(error);
            }
          });
        } else {
          const error = new APIError('No User Found with that email!', httpStatus.NOT_FOUND);
          return next(error);
        }
      }).catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  } else if (!!req.body.facebookId) {
    return User.getByFBId(req.body.facebookId)
      .then((user) => { //eslint-disable-line
        if (user) {
          const token = jwt.sign({
            email: user.email
          }, config.jwtSecret);
          const userCpy = user;   // update the user status object to
          userCpy.status.online = true; // reflect their current online status.
          userCpy.status.currentStatus = 'online';
          userCpy.status.activeToken = token;
          userCpy.save().then(updatedUser =>
            res.json({
              token,
              user: updatedUser,
            })
          );
        } else {
          const error = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
          return next(error);
        }
      }).catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  }
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
  return next(err);
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

function changePassword(req, res, next) {
  if (req.params.userId && req.body.password && req.body.newPassword) {
    User.get(req.params.userId).then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, same) => { //eslint-disable-line
          if (same) {
            const userCpy = user;
            userCpy.password = bcrypt.hashSync(req.body.newPassword, 10);
            userCpy.save().then(updatedUser => {
              updatedUser.otp = {};
              res.json(updatedUser)
            });
          } else {
            const error = new APIError('Password missmatch', httpStatus.UNAUTHORIZED);
            return next(error);
          }
        });
      } else {
        const error = new APIError('No User Found with that email!', httpStatus.NOT_FOUND);
        return next(error);
      }
    }).catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
  } else {
    const err = new APIError('Authentication error-2', httpStatus.UNAUTHORIZED);
    return next(err);
  }
}

function createPassword(req, res, next) {
  if (req.params.userId && req.body.password) {
    User.get(req.params.userId).then((user) => {
      if (user) {
        const userCpy = user;
        userCpy.password = bcrypt.hashSync(req.body.password, 10);
        userCpy.save().then(updatedUser => {
          updatedUser.otp = {};
          res.json(updatedUser)
        });
      } else {
        const error = new APIError('No User Found with that email!', httpStatus.NOT_FOUND);
        return next(error);
      }
    }).catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
  } else {
    const err = new APIError('Authentication error-2', httpStatus.UNAUTHORIZED);
    return next(err);
  }
}

function reportProblem(req, res, next) {
  if (req.params.userId && req.body.title && req.body.description) {
    User.get(req.params.userId).then((user) => {
      if (user) {
        emailVerification.sendProblemReportEmail(user, req.body)
          .then(({ success, notified }) => {
            success ? res.json({ 'sent': true }) : res.error('report problem failed.')
          });
      }
    });
  } else {
    const err = new APIError('Authentication error-2', httpStatus.UNAUTHORIZED);
    return next(err);
  }
}

function hallerFeedback(req, res, next) {
  if (req.params.userId && req.body.description) {
    User.get(req.params.userId).then((user) => {
      if (user) {
        emailVerification.sendFeedbackEmail(user, req.body)
          .then(({ success, notified }) => {
            success ? res.json({ 'sent': true }) : res.error('feedback failed.')
          });
      }
    });
  } else {
    const err = new APIError('Authentication error-2', httpStatus.UNAUTHORIZED);
    return next(err);
  }
}

//Admin API
function adminlogin(req, res, next) {
  if (!!req.body.email && !!req.body.password) {
    return User.getByEmail(req.body.email)
      .then((user) => { //eslint-disable-line
        if (user && user.role != 'student') {
          bcrypt.compare(req.body.password, user.password, (err, same) => { //eslint-disable-line
            if (same) {
              const token = jwt.sign({
                email: user.email
              }, config.jwtSecret);
              const userCpy = user;   // update the user status object to
              userCpy.status.online = true; // reflect their current online status.
              userCpy.status.currentStatus = 'online';
              userCpy.status.activeToken = token;
              userCpy.save().then(updatedUser =>
                res.json({
                  token,
                  user: updatedUser,
                })
              );
            } else {
              const error = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
              return next(error);
            }
          });
        } else {
          const error = new APIError('No User Found with that email!', httpStatus.NOT_FOUND);
          return next(error);
        }
      }).catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  }
}


function sendEmailResetPassword(req, res, next) {
  if (req.body.Email) {
    return User.getByEmail(req.body.Email)
      .then((user) => { //eslint-disable-line
        if (user && user.role != 'student') {
          var uid = Math.random();
          var passwordToken = uid.toString(36).substring(2, 18);
          let userData = {
            _id: user._id,
            passwordToken: passwordToken,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }

          emailVerification.sendForgotPasswordEmail(userData)
            .then((success, userNotify) => {
              user.passwordToken = passwordToken;
              user.save()
                .then((user) => {
                  return res.json('success');
                });
            }).catch(error => {
              const err = new APIError('Unable to proccess your request.', httpStatus.INTERNAL_SERVER_ERROR);
              return next(err);
            })
          // create reusable transporter object using the default SMTP transport
          // let transporter = nodemailer.createTransport({
          //   host: 'smtp.gmail.com',
          //   port: 465,
          //   secure: true, // secure:true for port 465, secure:false for port 587
          //   auth: {
          //     user: "support@gohaller.com", // project email
          //     pass: 'G0haller!'
          //   }
          // });
          // setup email data with unicode symbols
          // let mailOptions = {
          //   from: 'Haller Verification <support@gohaller.com>', // sender address
          //   to: email, // list of receivers
          //   subject: 'Verify your Haller email address ✔', // Subject line
          //   text: 'Click below link', // plain text body
          //   html: '<b>Click Here To change Account Password  : </b>' + "http://localhost:4200/forgotpassword/" + passwordToken // html body
          // };
          // send mail with defined transport object
          // transporter.sendMail(mailOptions, (error, info) => {
          //   if (error) {
          //     return console.log(error);
          //   } else {
          //     user.passwordToken = passwordToken;
          //     user.save()
          //       .then((user) => {
          //         return res.json('success');
          //       });
          //   }
          // });
        } else {
          return res.json('No User Found with that email');
        }
      }).catch((e) => {
        return res.json('invalid');
      });
  }
}

function changeUserPassword(req, res, next) {
  if (!req.body.token) { return res.json('Sorry invalid token'); }
  User.getByToken(req.body.token)
    .then((user) => {
      if (req.body.token == user.passwordToken) {
        user.password = req.body.password ? bcrypt.hashSync(req.body.password, 10) : '';
        user.save()
          .then((user) => {
            user.passwordToken = "user token"
            user.save()
            return res.json('success');
          });
      } else {
        return res.json('Failed to Updated password');
      }
    });
}

export default { changeUserPassword, sendEmailResetPassword, login, adminlogin, getRandomNumber, logout, encryptPassword, changePassword, createPassword, reportProblem, hallerFeedback };
