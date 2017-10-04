import 'mongoose-type-email';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

function toLower(v) {
  return v.toLowerCase();
}

const BotUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    index: true,
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    deviceToken: {
      type: String
    },
    os: { type: String },
    method: {
      type: String,
      enum: ['email', 'push']
    },
    frequency: {
      type: String,
      enum: [
        'weekly',
        'monthly',
        'daily',
        'immediately'
      ]
    }
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    unique: true,
    index: true,
    set: toLower
  },
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  status: {
    online: { type: Boolean },
    lastOnline: { type: Date },
    currentStatus: {
      type: String,
      enum: ['online', 'idle', 'offline']
    },
    activeToken: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
  },
  role: {
    type: String
  }
});

BotUserSchema.statics = {
  get(id) {
    return this.findOne({ _id: id })
      .exec().then((user) => {
        return user;
      });
  },
  getByEmailNoError(email) {
    return this.findOne({ email: email }).exec().then((user) => { return user; });
  },
  search(keyword, skip, limit) {
    var q = { $or: [{ role: { $exists: false } }, { role: { $ne: 'bot' } }] };
    if (keyword) {
      q = {
        $and: [{
          $or: [{ firstName: { $regex: '^' + keyword, $options: 'i' } }, { email: { $regex: '^' + keyword, $options: 'i' } },]
        }, q]
      }
    }
    // return this.find(q).skip(parseInt(skip)).limit(parseInt(limit)).exec().then((user) => { return user });
    return this.aggregate([
      { $match: q },
      { $project: { _id: 1, email: 1, firstName: 1, createdAt: 1 } },
      { $group: { count: { $sum: 1 }, _id: null, data: { $push: { _id: '$_id', email: '$email', firstName: '$firstName' } } } },
      { $addFields: { "data.total": "$count" } },
      { $unwind: "$data" },
      { $replaceRoot: { newRoot: "$data" } },
      { $skip: parseInt(skip) }, { $limit: parseInt(limit) },
      { $lookup: { from: "botconversations", localField: "_id", foreignField: "createdBy", as: "convo" } },
      { $project: { _id: 1, email: 1, firstName: 1, total: 1, convo: { "$arrayElemAt": ["$convo", 0] } } },
      {
        $project: {
          email: 1, firstName: 1, total: 1,
          "sentmsgs": {
            $cond: [{ '$eq': ['$convo', undefined] }, [{}],
            { $filter: { input: '$convo.messages', as: 'msg', cond: { $ifNull: ["$$msg.body", undefined] } } }]
          }
        }
      },
      { $group: { count: { $sum: { $size: { $ifNull: ['$sentmsgs', []] } } }, _id: { id: '$_id', email: '$email', firstName: '$firstName', total: '$total' } } },
      { $project: { email: '$_id.email', firstName: '$_id.firstName', _id: '$_id.id', total: '$_id.total', sentCount: '$count' } }
    ])
  },
  getForNotification(req, res, next) {
    return this.find({ 'notifications.deviceToken': { $exists: true, $ne: "" } })
      .exec().then((user) => { return user; });
  }
}

export default mongoose.model('BotUser', BotUserSchema);
