import 'mongoose-type-email';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import emailVerification from '../cronJobs/emailVerification';

function deleteEmpty(v) {
  if (v == null || !v) {
    return undefined;
  }
  return v;
}

function toLower(v) {
  return v.toLowerCase();
}
const populateMap = () =>
  [{
    path: 'organizations',
    model: 'Organization'
  }];

const blockedMap = () =>
  [{
    path: 'blocked.user',
    model: 'User'
  }];

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
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
  isRA: {
    type: Boolean,
    default: false
  },
  RAData: {
    inviteCode: {
      type: String,
      default: "REZLIFET1"
    },
    resFloor: {
      type: Number,
      default: 0
    },
    codeUsageCount: {
      type: Number,
      default: 0
    },
    verificationSent: {
      type: Date
    }
  },
  isRARequested: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationSent: {
    type: Date
  },
  currentCover: {
    type: mongoose.Schema.Types.Mixed
  },
  currentProfile: {
    type: mongoose.Schema.Types.Mixed
  },
  password: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  residence: {
    index: true,
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  hometown: {
    type: String, set: deleteEmpty
  },
  major: {
    type: String, set: deleteEmpty
  },
  graduationYear: {
    type: String,
  },
  genderPronouns: {
    type: [String],
  },
  bio: {
    type: String
  },
  lastLogin: {
    type: Date
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
  otp: {
    token: { type: String },
    active: { type: Boolean }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
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
  organizations: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
  }],
  blocked: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    at: { type: Date, default: new Date() }
  }],
  interests: [{ name: { type: String, required: true }, createdAt: { type: Date, default: new Date() } }],
  facebook: { type: mongoose.Schema.Types.Mixed },
  role: {
    type: String,
    default: 'student'
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
}, {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  });


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// UserSchema.post('save', (doc) => {
//   if (!doc.emailVerified && (!doc.verificationSent || doc.verificationSent === null)) {
//     sendVerificationEmail(doc);
//   }
// });

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  populateMap: populateMap,
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    console.info('getId', id);
    try {
      if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
        const objectId = mongoose.Types.ObjectId(id); //eslint-disable-line
        return this.findOne({ '_id': objectId }, { otp: false })
          .populate(populateMap())
          .exec()
          .then((user) => {
            if (user) {
              return user;
            }
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
          })
          .error(err => Promise.reject(err))
          .catch(err => Promise.reject(err));
      }
    } catch (exc) {
      console.log(exc);
    }
    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },
  getByCode(code) {
    return this.findOne({ 'RAData.inviteCode': code })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Get user
   * @param {string} email - The email address of user.
   * @returns {Promise<User, APIError>}
   */
  getByEmail(email) {
    return this.findOne({ email: email })
      .populate(populateMap())
      .exec()
      .then((user) => {
        if (user) {
          user.otp = {};
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByFBId(id) {
    return this.findOne({ 'facebook.id': id })
      .populate(populateMap())
      .exec()
      .then((user) => {
        if (user) {
          user.otp = {};
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50, blocked = [] } = {}) {
    let blockMe = { _id: { $nin: blocked } };
    return this.find(blockMe)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * List users in descending order of 'createdAt' timestamp who are RA.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listRAs() {
    return this.find({ 'isRA': true })
      .sort({ createdAt: -1 })
      .exec();
  },
  /**
   * List users in the current users residence in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listByResidence({ residence, skip = 0, limit = 50, blocked = [] } = {}) {
    return this.find({ residence: residence, _id: { $nin: blocked } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(populateMap())
      .exec();
  },
  /*
  Send an email verification to this user,
  I think it is best if we just give them a token to enter on the app login screen
  */
  sendUserVerificationEmail() {
    return emailVerification.sendVerificationEmail(this.email);
  },

  /*
  Send an RA verification email to this user,
  I think it is best if we just give them a token to enter on the app login screen
  */
  sendUserIsRARequestEmail() {
    return emailVerification.sendIsRAVerificationEmail(this.email);
  },

  userWhoBlockedMe(id) {
    return this.find({ 'blocked.user': { $in: [id] } }, { id: true }).exec();
  },
  getBlockedUsers(id) {
    try {
      if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
        const objectId = mongoose.Types.ObjectId(id); //eslint-disable-line
        return this.findOne({ '_id': objectId }, { password: false, otp: false })
          .populate(blockedMap())
          .exec()
          .then((user) => {
            if (user) {
              return user.blocked;
            }
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
          })
          .error(err => Promise.reject(err))
          .catch(err => Promise.reject(err));
      }
    } catch (exc) {
      console.log(exc);
    }
    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);