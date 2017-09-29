import httpStatus from 'http-status';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import APIError from '../helpers/APIError';
import BotUser from '../models/bot-users.model';
// import emailVerification from '../cronJobs/emailVerification';
// const apiai = require('apiai');
const bcrypt = require('bcryptjs');
const config = require('../../config/env');

var botuserCtrl = {
  getBotUser: (req, res, next) => {
    BotUser.getByEmailNoError('dev.bot@ku.edu')
      .then((bot) => {
        res.json(bot);
      })
  },
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
              user.save().then((savedUser) => { res.json(savedUser); })
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
        console.log('changePassword fail!', eroor);
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
            password: bcrypt.hashSync(req.body.password, 10), firstName: req.body.firstName
          });
          user.save()
            .then((savedUser) => {
              const token = jwt.sign({ email: savedUser.email }, config.jwtSecret);
              const userCpy = savedUser;   // update the user status object to
              userCpy.status.activeToken = token;
              userCpy.save().then((upU) => { res.json({ token, user: upU }); });
            })
            .catch((eroor) => {
              console.log('create eroor l2', eroor);
              const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
              return next(err);
            });
        }
      }, error => {
        console.log('create eroor l1', eroor);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  }
}

export default botuserCtrl;
