import httpStatus from 'http-status';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import APIError from '../helpers/APIError';
import BotNotification from '../models/bot-notifications.model';

var botNotiCtrl = {
  getForMe: (req, res, next) => {
    const { skip = 0, limit = 50 } = req.query;
    BotNotification.getForRecipients(req.params.userId, skip, limit)
      .then((notifications) => {
        res.json(notifications);
      }, error => {
        console.log('logout error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  },
  getByMe: (req, res, next) => {
    const { skip = 0, limit = 50 } = req.query;
    BotNotification.getByCreater(req.params.userId, skip, limit)
      .then((notifications) => {
        res.json(notifications);
      }, error => {
        console.log('logout error', error);
        const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
        return next(err);
      })
  }
}

export default botNotiCtrl;
