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
  }];

const types = {
  1: 'Simple Notification',
  2: 'Bot conversation Notification'
};

BotNotificationSchema.statics = {
  getByCreater(userId, skip, limit) {
    return this.find({ createdBy: userId }).skip(parseInt(skip)).limit(parseInt(limit)).sort({ createdAt: -1 })
      .populate(populateMap()).exec().then((notifications) => { return notifications });
  },
  getForRecipients(userId, skip, limit) {
    return this.find({ $or: [{ recipients: userId }, { recipients: { $eq: [] } }] }).skip(parseInt(skip)).limit(parseInt(limit)).sort({ createdAt: -1 })
      .populate(populateMap()).exec().then((notifications) => { return notifications });
  }
};

export default mongoose.model('BotNotification', BotNotificationSchema);
