import _ from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import Conversation from '../models/conversation.model';
import APIError from '../helpers/APIError';

/**
 * get notification by id
 * @returns {Notification}
 */
function get(req, res, next) {
  Notification.get(req.params.notificationId)
    .then(notif => res.json(notif))
    .error(e => next(e))
    .catch((e) => {
      next(e);
    });
}

/**
 * list notifications by recipient userId
 * @returns {Notification[]}
 */
function list(req, res, next) {
  Notification.list({ userId: req.params.userId, skip: 0, limit: 50 })
    .then(notifs =>
      res.json(notifs)
    )
    .error(e =>
      next(e)
    )
    .catch(e =>
      next(e)
    );
}
/*
  Update Notification
*  @param {ObjectId} notificationId - id of the notification
*  @param {Boolean} read - mark the notification read
*/
function update(req, res, next) { //eslint-disable-line
  if (req.params.notificationId) {
    Notification.get(req.params.notificationId).then((notification) => {
      const savedNotif = notification;
      savedNotif.read = req.body.read;
      savedNotif.updatedAt = new Date();
      savedNotif.save().then((sNotif) => {
        sNotif.populate([{
          path: 'createdBy',
          model: 'User'
        }, {
          path: 'recipient',
          model: 'User'
        }], (err, doc) => {
          if (err) {
            return next(err);
          } else if (doc) {
            return res.json(doc);
          }
          const error = new APIError('No such notification exists!', httpStatus.NOT_FOUND);
          return next(error);
        });
      });
    });
  } else {
    const err = new APIError('Invalid Request - missing notificationId route param', httpStatus.BAD_REQUEST);
    return next(err);
  }
}

/*
  Create Notification
*  @param {ObjectId} createdBy - Id of the person creating the notification
*  @param {ObjectId} recipient - User to Notify
*  @param {string} body - body of the notification
*  @param {string} actionTaken - one of stra, going, reminder, comment
*  @param {string} objectId - _id of the object being acted on
*  @param {string} objectType - type of object - one of Event, Post, Conversation
*/
function create(req, res, next) { //eslint-disable-line
  const notif = new Notification(_.extend(req.body, {
    _id: mongoose.Types.ObjectId(), //eslint-disable-line
    createdAt: new Date()
  }));
  notif.save().then((notification) => {
    notification.populate([{
      path: 'createdBy',
      model: 'User'
    }, {
      path: 'recipient',
      model: 'User'
    }], (err, doc) => {
      if (err) {
        return next(err);
      } else if (doc) {
        return res.json(doc);
      }
      const error = new APIError('No such notification exists!', httpStatus.NOT_FOUND);
      return next(error);
    });
  });
}

/**
 * Remove Notification.
 * @returns {Notification}
 */
function remove(req, res, next) {
  Notification.get(req.params.notificationId)
    .then((notif) => {
      notif.remove()
        .then(deletedNotif => res.json(deletedNotif))
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

function readNotification(req, res, next) {
  Notification.get(req.params.notificationId)
    .then(notification => {
      notification.recipients.forEach(item => {
        if (item.user._id == req.params.userId) {
          item.read = true;
        }
      });
      notification.save().then(savedNotification => {
        var notiesObj = {};
        if ([10, 4, 17].indexOf(savedNotification.type) > -1) {
          if (savedNotification.post) {
            notiesObj._id = savedNotification._id;
            notiesObj.type = savedNotification.type;
            notiesObj.post = { details: savedNotification.post.details, _id: savedNotification.post._id };
            if (savedNotification.type == 10) {
              var data = getNamesFromArray(savedNotification.post.comments);
              notiesObj.title = data + ' ' + 'commented on your ' + (savedNotification.post.isEvent ? 'event' : 'post');
              notiesObj.lastObj = savedNotification.post.comments[savedNotification.post.comments.length - 1];
            } else if (savedNotification.type == 17) {
              var data = getNamesFromArray(savedNotification.post.going);
              notiesObj.title = data + ' ' + 'joined your event.';
              notiesObj.lastObj = savedNotification.post.going[item.post.going.length - 1];
            } else if (savedNotification.type == 4) {
              var data = getNamesFromArray(savedNotification.post.liked);
              notiesObj.title = data + ' ' + 'liked your event.';
              notiesObj.lastObj = savedNotification.post.liked[savedNotification.post.liked.length - 1];
            }
            var recipient = _.filter(savedNotification.recipients, function (savedNotification) {
              return savedNotification.user._id == req.params.userId
            })
            notiesObj.read = recipient[0].read;
            notiesObj.createdAt = savedNotification.createdAt;
          }
          res.json(notiesObj);
        } else {
          res.json({});
        }
      })
    })
}

function getUnreadNotificationCount(req, res, next) {
  var query = [{ 'recipients.user': req.params.userId }, { type: { $in: [10, 4, 17, 20] } }]
  if (req.body.notificationId) query.push({ _id: { $gt: mongoose.Types.ObjectId(req.body.notificationId) } });
  Notification.find({ $and: query }).populate([{ path: 'post', model: 'Post' }]).skip(0).limit(50).exec().then(notifs => {
    var notifyCount = 0;
    notifs.forEach(function (noti) {
      if (noti.post) {
        notifyCount++;
      }
    }, this);
    var qOr = [{ 'messages.readBy.user': { $ne: req.params.userId } }, { 'messages.createdBy': { $ne: req.params.userId } }];
    var qAnd = [{ 'leftUser.user': { $ne: req.params.userId } }];
    qAnd.push({ 'deletedFor.user': { $ne: req.params.userId } });
    // qAnd.push({ $or: qOr, 'participants': req.params.userId });
    qAnd.push({ 'participants': req.params.userId });
    qAnd.push({ 'messages.readBy.user': { $ne: req.params.userId } });
    qAnd.push({ 'messages.createdBy': { $ne: req.params.userId } });
    Conversation.find({ $and: qAnd })
      .exec().then(convo => {
        res.json({ 'convo': convo.length, 'notiCount': notifyCount });
      })
      .catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  });
}

function getNotification(req, res, next) {
  const { limit = 50, skip = 0, university = false } = req.query;
  Notification.list({ userId: req.params.userId, skip, limit, university })
    .then(noties => {
      var finalNoties = [];
      noties.forEach(item => {
        if ([10, 4, 17].indexOf(item.type) > -1) {
          if (item.post) {
            var notiesObj = {};
            notiesObj._id = item._id;
            notiesObj.type = item.type;
            notiesObj.post = { details: item.post.details, _id: item.post._id };
            notiesObj.message = item.post.details;
            var data = '';
            if (item.type == 10) {
              data = getNamesFromArray(item.post.comments);
              notiesObj.title = data + ' commented on your ' + (item.post.isEvent ? 'event' : 'post');
              notiesObj.lastObj = item.post.comments[item.post.comments.length - 1];
            } else if (item.type == 17) {
              data = getNamesFromArray(item.post.going);
              notiesObj.title = data + ' joined your event.';
              notiesObj.lastObj = item.post.going[item.post.going.length - 1];
            } else if (item.type == 4) {
              data = getNamesFromArray(item.post.liked);
              notiesObj.title = data + ' liked your ' + (item.post.isEvent ? 'event' : 'post');
              notiesObj.lastObj = item.post.liked[item.post.liked.length - 1];
            }
            var recipient = _.filter(item.recipients, function (item) {
              return item.user._id == req.params.userId
            })
            notiesObj.read = recipient[0].read;
            notiesObj.createdAt = item.createdAt;
            if (data.length)
              finalNoties.push(notiesObj);
          }
        } else if (item.type == 20) {
          var notiesObj = {};
          notiesObj._id = item._id;
          notiesObj.type = item.type;
          notiesObj.title = item.body.title;
          notiesObj.message = item.body.message;
          notiesObj.createdAt = item.createdAt;
          notiesObj.university = { logo: 'assets/img/user-group.png' };
          finalNoties.push(notiesObj);
        }
      })
      res.json(finalNoties);
    })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

function getNamesFromArray(nameList) {
  var names = [];
  var allNames = [];
  for (var n = (nameList.length - 1); n >= 0; n--) {
    var fullName = nameList[n].createdBy ? (nameList[n].createdBy.firstName + ' ' + nameList[n].createdBy.lastName) : (nameList[n].actedBy.firstName + ' ' + nameList[n].actedBy.lastName);
    if (allNames.indexOf(fullName) == -1) {
      allNames.push(fullName);
      if (names.length < 3) names.push(fullName);
    }
  }
  return names.join(', ') + (allNames.length > 3 ? (allNames.length - 3) : '');
}

export default { get, list, create, update, remove, getNotification, readNotification, getUnreadNotificationCount };
