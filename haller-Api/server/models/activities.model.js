import 'mongoose-type-email';
import sanitizeHtml from 'sanitize-html';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const types = {
  1: 'Created a new post',
  2: 'Updated a post',
  3: 'Deleted a post',
  4: 'Liked a post',
  5: 'Unliked a post',
  6: 'Flaged a post',
  7: 'Unflaged a post',
  8: 'Saved a post',
  9: 'Unsaved a post',
  10: 'Commented on a post',
  11: 'Updated a comment',
  12: 'Deleted a comment',
  13: 'Liked a comment',
  14: 'Unliked a comment',
  15: 'Flaged a comment',
  16: 'Unflaged a comment',
  17: 'Joined an event',
  18: 'Left an event',
  19: 'Message Sent',
  20: 'University',
  21: 'Admin'
}

const populateMap = () =>
  [{
    path: 'post',
    model: 'Post'
  }, {
    path: 'post.createdBy',
    model: 'User',
  }, {
    path: 'post.cover'
  }, {
    path: 'comment',
    model: 'User',
  }];

const ActivitiesSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  comment: {
    type: String,
  },
  activityType: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
});

ActivitiesSchema.method({
});

/**
 * Statics
 */
ActivitiesSchema.statics = {
  types: types,
  get(id) {
    if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
      return this.find({ createdBy: id })
        .populate(populateMap())
        .sort({ '_id': -1 })
        .exec()
        .then((activities) => {
          // if (activities) {
          return activities;
          // }
          // const err = new APIError('No such User exists!', httpStatus.NOT_FOUND);
          // return Promise.reject(err);
        });
    } else {
      const err = new APIError('Invalid UserId!', httpStatus.BAD_REQUEST);
      return Promise.reject(err);
    }
  }
}

export default mongoose.model('Activities', ActivitiesSchema);
