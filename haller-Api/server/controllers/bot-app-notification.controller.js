import _ from 'lodash';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import APIError from '../helpers/APIError';
import BotNotification from '../models/bot-notifications.model';
import BotUser from '../models/bot-users.model';
import FCMSender from '../helpers/FCMSender';
import Library from '../models/library.model';

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
  },
  createUniversityNotification: (req, res, next) => {
    var notiObje = { _id: mongoose.Types.ObjectId(), type: 1 };
    if (!req.body.title && !req.body.message) { return res.json({ "message": " no data found " }); }
    createNotification(req, res, next, notiObje);
  }

}

function createNotification(req, res, next, notiObje = {}) {
  console.log(req.body.createdAt);
  notiObje.createdAt = req.body.createdAt;
  notiObje.body = {
    title: req.body.title,// || 'Haller University says',
    message: req.body.message,// || 'Hello friends, this is lorem ippsem.',
  };
  if (req.body.residence) {
    notiObje['residence'] = req.body.residence;
  }
  if (req.body.recipients && req.body.recipients.length > 0) {
    notiObje.recipients = [];
    req.body.recipients.forEach((value, index, array) => {
      notiObje.recipients.push({ user: value });
    })
  }

  if (req.body.file) {
    const lib = new Library(_.extend(req.body.file, { _id: mongoose.Types.ObjectId() }));
    lib.save()
      .then((libItem) => {
        notiObje.body.image = libItem._id
        notiObje.createdBy = req.body.createdBy;
        var notification = new BotNotification(notiObje);
        notification.save().then(savedNoti => {
          BotNotification.get(savedNoti._id)
            .then(noti => { res.json(noti); sendUniversityNotification(noti, next); })
            .catch(e => { console.info('university savedNoti error', e); next(e); });
        }).catch((e) => { console.log(e); next(e); });
      })
      .catch((e) => { console.log(e); next(e); });
  } else {
    notiObje.createdBy = req.body.createdBy;
    var notification = new BotNotification(notiObje);
    notification.save().then(savedNoti => {
      BotNotification.get(savedNoti._id)
        .then(noti => {res.json(noti); sendUniversityNotification(noti, next); })
        .catch(e => { console.info('university savedNoti error', e); next(e); });
    }).catch(e => { console.info('university savedNoti error', e); next(e); });
  }
}

function sendUniversityNotification(notification, next) {
  if (notification.recipients && notification.recipients.length > 0) {
    FCMSender.sendCustomUniversityNotification(notification.recipients, notification);
  } else {
    console.log('notification.residence', notification.residence);
    BotUser.getUserForNotification(notification.residence || null)
      .then(users => {
        FCMSender.sendUniversityNotification(users, notification);
      }).catch(e => { console.info('university savedNoti error', e); next(e); });
  }
}

export default botNotiCtrl;
