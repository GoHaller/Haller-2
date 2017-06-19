import _ from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Notification from '../models/notification.model';
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
export default { get, list, create, update, remove };
