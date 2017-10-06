import 'mongoose-type-email';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


/**
 * BotNotification Schema
 * Represents the notification object to notify users of interactions on their content.
 */
const BotNotificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    index: true
  },
  body: {
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    image: {
      type: mongoose.Schema.ObjectId,
      ref: 'Library',
    }
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'BotConversation'
  },
  type: {
    type: Number,
    required: true
  },
  recipients: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'BotUser',
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
    ref: 'BotUser',
  },
});

const populateMap = () =>
  [{
    path: 'body.image',
    model: 'Library'
  },
  {
    path: 'recipients.user',
    model: 'BotUser'
  }];

const types = {
  1: 'Simple Notification',
  2: 'Bot conversation Notification'
};

BotNotificationSchema.statics = {
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
  getByCreater(userId, skip, limit) {
    console.log(populateMap());
    return this.find({ createdBy: userId }).skip(parseInt(skip)).limit(parseInt(limit)).sort({ createdAt: -1 })
      .populate(populateMap()).exec().then((notifications) => { return notifications });
  },
  getForRecipients(userId, skip, limit) {
    return this.find({ $or: [{ "recipients.user": userId }, { recipients: { $eq: [] } }] }).skip(parseInt(skip)).limit(parseInt(limit)).sort({ createdAt: -1 })
      .populate(populateMap()).exec().then((notifications) => { return notifications });
  }
};

export default mongoose.model('BotNotification', BotNotificationSchema);
