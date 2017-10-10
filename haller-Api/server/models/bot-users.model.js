import 'mongoose-type-email';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import BotConversation from '../models/bot-conversation.model';


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
    var q = { $or: [{ role: { $exists: false } }, { role: { $eq: 'student' } }] };
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
      { $unwind: "$data" },
      { $skip: parseInt(skip) }, { $limit: parseInt(limit) },
      { $group: { _id: null, data: { $push: { _id: '$data._id', email: '$data.email', firstName: '$data.firstName', total: "$count" } } } },
      { $unwind: "$data" },
      { $project: { _id: '$data._id', email: '$data.email', firstName: '$data.firstName', total: "$data.total" } },
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
      { $group: { count: { $sum: { $size: { $ifNull: ['$sentmsgs', []] } } }, _id: { _id: '$_id', email: '$email', firstName: '$firstName', total: '$total' } } },
      { $project: { email: '$_id.email', firstName: '$_id.firstName', _id: '$_id._id', total: '$_id.total', sentCount: '$count' } }
    ])
  },
  getForNotification(req, res, next) {
    return this.find({ 'notifications.deviceToken': { $exists: true, $ne: "" } })
      .exec().then((user) => { return user; });
  },
  userWhoBlockedMe(id, includeBot = false) {
    // return this.find({ 'blocked.user': { $in: [id] } }, { id: true }).exec();
    var orq = [{ 'blocked.user': { $in: [id] } }, { 'deleted': true }, { 'role': 'admin' }];
    if (!includeBot) orq.push({ 'role': 'bot' })
    return this.find({ $or: orq }, { _id: 1 }).exec();
  },

  getUserAnalytics(req, res, next) {
    var email = 'dev.bot@ku.edu';// + domain;, facebook: 1
    this.findOne({ email: email, role: 'bot' })
      .then(bot => {
        this.find({ $or: [{ role: { $exists: false } }, { role: { $eq: 'student' } }] }, { _id: 1, firstName: 1, lastName: 1, residence: 1, graduationYear: 1, facebook: 1, organizations: 1 }).populate('organizations', 'name').lean().exec().then((users) => {
          let count = 1;
          users.forEach((user, index, array) => {
            console.log('user._id', user._id);
            let userId = user._id;
            BotConversation.aggregate([{ $match: { participants: userId } },
            { $group: { msgCount: { $sum: { $size: '$messages' } }, convoCount: { $sum: 1 }, _id: null } }], (err, totalCount) => {
              BotConversation.find({ $and: [{ participants: userId }, { participants: { $size: 2 } }] })
                .count((error1msg, oneToOneCount) => {
                  BotConversation.aggregate([{ $match: { participants: userId } },
                  {
                    "$project": {
                      "sentmsgs": { $filter: { input: '$messages', as: 'msg', cond: { $eq: ["$$msg.createdBy", userId] } } }
                    }
                  }, { $group: { count: { $sum: { $size: '$sentmsgs' } }, _id: null } }], (errorsent, sentCount) => {
                    return BotConversation.findOne({ $and: [{ participants: userId }, { participants: { $size: 2 } }, { participants: bot._id }] },
                      { _id: 1, 'messages.createdBy': 1, 'messages.createdAt': 1 }).lean().exec().then((botConvo) => {
                        user['analyticsMsg'] = { userId: userId, totalCount: totalCount[0] ? totalCount[0] : null, oneToOneCount: oneToOneCount, sentCount: sentCount[0] ? sentCount[0].count : 0, bot: botConvo ? botConvo.messages : botConvo };
                        if (count == array.length) {
                          console.log(users);
                          //return users;
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({ 'users': users }, null, 4));
                        } else {
                          count += 1;
                        }
                      })
                  })
                })
            })
          })
        })
      }, error => { }).catch((e) => { return next(e); });
  }
}

export default mongoose.model('BotUser', BotUserSchema);
