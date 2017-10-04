import httpStatus from 'http-status';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import APIError from '../helpers/APIError';
import BotUser from '../models/bot-users.model';
import emailVerification from '../cronJobs/emailVerification';
// const apiai = require('apiai');
const bcrypt = require('bcryptjs');
const config = require('../../config/env');

var botuserCtrl = {
  getBotUser: (req, res, next) => { BotUser.getByEmailNoError('dev.bot@ku.edu').then((bot) => { res.json(bot) }); },
  logout: (req, res, next) => {
    BotUser.get(req.params.userId)
      .then((user) => {
        if (user) {
          const userCpy = user;
          userCpy.status.online = false;
          userCpy.status.currentStatus = 'offline';
          userCpy.status.activeToken = '';
          userCpy.save().then(updatedUser => res.json({ success: true }));
        } else {
          const error = new APIError('Authentication fail!', httpStatus.UNAUTHORIZED);
          return next(error);
        }
      }, error => {
        console.log('logout error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      });
  },
  login: (req, res, next) => {
    BotUser.getByEmailNoError(req.body.email)
      .then((user) => {
        if (user && user._id) {
          bcrypt.compare(req.body.password, user.password, (err, same) => { //eslint-disable-line
            if (same) {
              const token = jwt.sign({ email: user.email }, config.jwtSecret);
              const userCpy = user;   // update the user status object to
              userCpy.status.online = true; // reflect their current online status.
              userCpy.status.currentStatus = 'online';
              userCpy.status.lastOnline = new Date();
              userCpy.status.activeToken = token;
              userCpy.save().then(updatedUser => { res.json({ token, user: updatedUser, }) }
                , error => {
                  console.log('login error', error);
                  const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
                  return next(err);
                });
            } else {
              const error = new APIError('Authentication fail!', httpStatus.UNAUTHORIZED);
              return next(error);
            }
          });
        } else {
          const error = new APIError('Authentication fail!', httpStatus.UNAUTHORIZED);
          return next(error);
        }
      },
      (error) => {
        console.log('login error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  },
  changePassword: (req, res, next) => {
    BotUser.get(req.body.id)
      .then((user) => {
        if (user && user._id) {
          bcrypt.compare(req.body.password, user.password, (err, same) => { //eslint-disable-line
            if (same) {
              user.password = bcrypt.hashSync(req.body.passwordnew, 10);
              user.save().then((savedUser) => { res.json(savedUser); });
            } else {
              const error = new APIError('Current password does not match.', httpStatus.UNAUTHORIZED);
              return next(error);
            }
          })
        } else {
          const error = new APIError('Authentication fail!', httpStatus.UNAUTHORIZED);
          return next(error);
        }
      }, error => {
        console.log('changePassword fail!', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      });
  },
  create: (req, res, next) => {
    BotUser.getByEmailNoError(req.body.email)
      .then((user) => {
        if (user && user._id) {
          const err = new APIError('Use different email address', httpStatus.UNAUTHORIZED);
          return next(err);
        } else {
          const user = new BotUser({
            _id: mongoose.Types.ObjectId(), email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10), firstName: req.body.firstName,
            notifications: req.body.notifications
          });
          user.save()
            .then((savedUser) => {
              const token = jwt.sign({ email: savedUser.email }, config.jwtSecret);
              const userCpy = savedUser;   // update the user status object to
              userCpy.status.activeToken = token;
              userCpy.save().then((upU) => { res.json({ token, user: upU }); });
            })
            .catch((error) => {
              console.log('create error l2', error);
              const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
              return next(err);
            });
        }
      }, error => {
        console.log('create error l1', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  },
  update: (req, res, next) => {
    BotUser.get(req.body.userId)
      .then((user) => {
        if (user && user._id) {
          if (req.body.notifications) {
            user.notifications = req.body.notifications;
            if (user.notifications.enabled == undefined || user.notifications.enabled == 'undefined') {
              user.notifications.enabled = true;
            }
          }
          if (req.body.firstName) {
            user.firstName = req.body.firstName;
          }
          user.save().then((savedUser) => { res.json(savedUser) });
        } else {
          const err = new APIError('User not found.', httpStatus.UNAUTHORIZED);
          return next(err);
        }
      }, error => {
        console.log('update error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  },
  problem: (req, res, next) => {
    if (req.params.userId && req.body.title && req.body.description) {
      BotUser.get(req.params.userId).then((user) => {
        if (user) {
          emailVerification.sendBotProblemReportEmail(user, req.body)
            .then(({ success, notified }) => {
              success ? res.json({ 'sent': true }) : res.error('report problem failed.')
            });
        }
      });
    } else {
      const err = new APIError('Authentication error-2', httpStatus.UNAUTHORIZED);
      return next(err);
    }
  },
  feedback: (req, res, next) => {
    if (req.params.userId && req.body.description) {
      BotUser.get(req.params.userId).then((user) => {
        if (user) {
          emailVerification.sendBotFeedbackEmail(user, req.body)
            .then(({ success, notified }) => {
              success ? res.json({ 'sent': true }) : res.error('feedback failed.')
            });
        }
      });
    } else {
      const err = new APIError('Authentication error-2', httpStatus.UNAUTHORIZED);
      return next(err);
    }
  },
  searchUser: (req, res, next) => {
    const { keyword = null, skip = 0, limit = 10 } = req.query;
    BotUser.search(keyword, skip, limit)
      .then((users) => {
        res.json(users);
      }, error => {
        console.log('searchUser error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      }).catch(error => {
        console.log('searchUser error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  },
  getForNotification: (req, res, next) => {
    BotUser.find({ 'notifications.deviceToken': { $exists: true, $ne: "" } })
      .then((users) => { res.json(users); })
      .catch((e) => { return next(e); });
  }
}

export default botuserCtrl;
