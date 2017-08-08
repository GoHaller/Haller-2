import 'mongoose-type-email';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Notification Schema
 * Represents the notification object to notify users of interactions on their content.
 */
const NotificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    index: true
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  body: {
    title: { type: String, default: '' },
    message: { type: String, default: '' }
  },
  objectId: {
    type: String,
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation'
  },
  type: {
    type: Number,
    required: true
  },
  recipients: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    read: { type: Boolean, default: false },
    readAt: Date,
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});
/*
  Map of paths to populate for mongoose.populate method
*/
const populateMap = () =>
  [{
    path: 'recipients.user',
    model: 'User',
  }, {
    path: 'createdBy',
    model: 'User',
  }, {
    path: 'conversation',
    model: 'Conversation',
  }, {
    path: 'post',
    model: 'Post',
    populate: [{
      path: 'going.actedBy',
      model: 'User'
    }, {
      path: 'comments.createdBy',
      model: 'User',
    }, {
      path: 'liked.actedBy',
      model: 'User',
    }]
  }];


NotificationSchema.statics = {
  /**
   * Get a Notification by id
   * @param {ObjectId} id - The objectId of Notification.
   * @returns {Promise<Notification, APIError>}
   */
  get(id) {
    if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
      return this.findById(id)
        .populate(populateMap())
        .exec()
        .then((notification) => {
          if (notification) {
            return notification;
          }
          const err = new APIError('No such Notification exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        })
        .error(err => Promise.reject(err))
        .catch(err => Promise.reject(err));
    }
    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },

  getByPostAndType(type, postId) {
    return this.findOne({ 'type': type, post: postId })
      .populate(populateMap())
      .exec()
      .then((notification) => {
        return notification;
      })
      .error(err => Promise.reject(err))
      .catch(err => Promise.reject(err));
  },

  /**
   * List conversations in descending order of 'createdAt' timestamp.
   * @param {ObjectId} userId - Id of the recipients to get Notifications for.
   * @param {number} skip - Number of notifications to be skipped.
   * @param {number} limit - Limit number of notifications to be returned.
   * @returns {Promise<Conversation[]>}
   */
  list({ userId, skip = 0, limit = 50, university = false } = {}) {
    if (userId.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
      try {
        var q = { 'recipients.user': userId, type: { $in: [10, 4, 17] } };
        if (university == 'true') q = { type: 20 };
        return this.find(q)
          .populate(populateMap())
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec();
      } catch (exc) {
        return Promise.reject(exc);
      }
    }

    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },

  getNamesFromArray(nameList, userId) {
    var names = [];
    var allNames = [];
    for (var n = (nameList.length - 1); n >= 0; n--) {
      if (userId !== nameList[n]._id) {
        var fullName = nameList[n].createdBy ? (nameList[n].createdBy.firstName + ' ' + nameList[n].createdBy.lastName) : (nameList[n].actedBy.firstName + ' ' + nameList[n].actedBy.lastName);
        if (allNames.indexOf(fullName) == -1) {
          allNames.push(fullName);
          if (names.length < 3) names.push(fullName);
        }
      }
    }
    return names.join(', ') + (allNames.length > 3 ? (allNames.length - 3) : '');
  },

getUsersNotification(userId ,skip = 0, limit = 10){
    return this.find({'createdBy' : userId })
      .populate(populateMap())
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
      .then((notification) => {
        if (notification) {
          return notification;
        }
        else return null;
      });
},

getAllUsersNotification(skip = 0, limit = 10){
    return this.find()
      .populate(populateMap())
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
      .then((notification) => {
        if (notification) {
          return notification;
        }
        else return null;
      });
}



};

/**
 * @typedef Notification
 */
export default mongoose.model('Notification', NotificationSchema);
