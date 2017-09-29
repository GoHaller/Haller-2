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
    return this.findOne({ email: email })
      .exec().then((user) => {
        return user;
      });
  },
}

export default mongoose.model('BotUser', BotUserSchema);
