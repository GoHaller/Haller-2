import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import emailVerification from '../cronJobs/emailVerification';

const config = require('../../config/env');
const bcrypt = require('bcryptjs');

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
        userCpy.save().then(() => res.sendStatus(httpStatus.OK)).catch(e => next(e));
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
        if (user) {
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
            const error = new APIError('Authentication error-1', httpStatus.UNAUTHORIZED);
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
            success ? res.json({ 'sent': true }) : res.error('not successful notifying user by email')
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
          const error = new APIError('No User Found with that email!', httpStatus.NOT_FOUND);
          return next(error);
        }
      }).catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  }
}

export default { login, adminlogin, getRandomNumber, logout, encryptPassword, changePassword, createPassword, reportProblem };
