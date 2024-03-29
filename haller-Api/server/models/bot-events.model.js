import 'mongoose-type-email';
import sanitizeHtml from 'sanitize-html';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


/*
  Cleans html to remove any unallowed characters or html tags.
*/
function cleanHtml(val) {
  return sanitizeHtml(val, {
    allowedTags: ['h3', 'h4', 'h5', 'h6', 'p', 'a', 'b',
      'i', 'strong', 'em', 'br'
    ]
  });
}

/**
 * UserAction Schema
 * Represents the flagged, starred and going user actions object for posts and events
 */
const UserAction = new mongoose.Schema({
  actedAt: {
    type: Date,
    default: new Date()
  },
  actedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'BotUser',
    required: true
  },
  actionType: {
    type: String,
    enum: ['going', 'star', 'flag', 'like']
  },
  actionStatus: {
    type: String,
    enum: ['Pending Review', 'In Review', 'Reviewed']
  }
});
/**
 * Comment Schema
 * Represents the comment object for posts and events
 */
const Comment = new mongoose.Schema({
  body: {
    type: String,
    set: cleanHtml,
    required: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'BotUser',
    required: true
  },
  liked: {
    type: [UserAction],
  },
  flagged: {
    type: [UserAction]
  },
  starred: {
    type: [UserAction]
  },
  image: {
    type: mongoose.Schema.Types.Mixed
  },
  giphy: {
    id: { type: mongoose.Schema.Types.Mixed },
    still: { type: mongoose.Schema.Types.Mixed },
    gif: { type: mongoose.Schema.Types.Mixed }
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  actionStatus: {
    type: Number,
    default: 0
  }
});
/*
  Map of paths to populate for mongoose.populate method
*/
const populateMap = () =>
  [{
    path: 'createdBy',
    model: 'BotUser'
  }, {
    path: 'comments.createdBy',
    model: 'BotUser',
  }, {
    path: 'comments.starred.actedBy',
    model: 'BotUser',
  }, {
    path: 'comments.flagged.actedBy',
    model: 'BotUser',
  }, {
    path: 'liked.actedBy',
    model: 'BotUser',
  }, {
    path: 'starred.actedBy',
    model: 'BotUser',
  }, {
    path: 'flagged.actedBy',
    model: 'BotUser'
  }, {
    path: 'going.actedBy',
    model: 'BotUser'
  }, {
    path: 'cover',
    model: 'Library'
  }, {
    path: 'comments.image',
    model: 'Library'
  }
  ];

/**
 * BotEvent Schema
 * Represents the major interaction with the system, the post object
 */
const BotEventSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
  },
  comments: {
    type: [Comment],
  },
  residentsFeed: {
    type: Boolean,
    required: true
  },
  discoveryFeed: {
    type: Boolean,
    required: true
  },
  title: {
    type: String
  },
  location: {
    type: String
  },
  cover: [{   // allow users to upload multiple images with their post/event
    type: mongoose.Schema.ObjectId,
    ref: 'Library',
  }],
  giphy: {
    id: { type: mongoose.Schema.Types.Mixed },
    still: { type: mongoose.Schema.Types.Mixed },
    gif: { type: mongoose.Schema.Types.Mixed }
  },
  authorResidence: {
    type: String
  },
  time: {
    type: String
  },
  date: {
    type: Date,
  },
  isEvent: {
    type: Boolean,
    required: true
  },
  liked: {
    type: [UserAction],
  },
  starred: {
    type: [UserAction],
  },
  going: {
    type: [UserAction],
  },
  flagged: {
    type: [UserAction],
  },
  details: {
    type: String,
    set: cleanHtml
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'BotUser',
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  },
  deletedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'BotUser',
    required: false
  },
  deletedAt: {
    type: Date,
    default: new Date(),
    required: false
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  actionStatus: {
    type: Number,
    default: 0
  }
});
/*
actionStatus
    0: Nothing
    1: No further action needed
 */
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
BotEventSchema.method({
});

/**
 * Statics
 */
BotEventSchema.statics = {
  populateMap: populateMap,
  /**
   * Get Post
   * @param {ObjectId} id - The objectId of post.
   * @returns {Promise<Post, APIError>}
   */
  get(id) {
    if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
      return this.findById(id)
        .populate(populateMap())
        .exec()
        .then((event) => {
          if (event) {
            return event;
          }
          const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        });
    }
    const err = new APIError('Invalid eventId!', httpStatus.BAD_REQUEST);
    return Promise.reject(err);
  },
  /**
   * Get all Posts
   * @returns {Promise<Post, APIError>}
   */
  getAll() {
    return this.find()
      .populate(populateMap())
      .exec()
      .then((event) => {
        if (event) {
          return event;
        }
        else return null;
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50, deleted = false } = {}) {
    return this.find({ deleted: deleted })
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {string} feed - the feed identifier to filter results by
   * @param {string} residenceHall - the residence hall of the current user to filter
                     the residents feed by.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<User[]>}
   */
  listByFeed({ feed = 'all', residenceHall, skip = 0, limit = 50, isEvent = null, blockedMe = [], deleted = false } = {}) {
    const q = { $or: [{ deleted: { $exists: false } }, { deleted: deleted }] };
    console.log("test :" + feed);
    if (feed === 'discovery') { q.discoveryFeed = true; }
    else if (feed === 'residents') {
      q.residentsFeed = true;
      q.authorResidence = residenceHall;
    } else {
      q.discoveryFeed = false;
      q.residentsFeed = false;
    }
    q.createdBy = { $nin: blockedMe };
    console.log(q);
    if (isEvent != null) q.isEvent = isEvent
    return this.find(q)
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * List posts in the user identified by the userId residence in descending
   * order of 'createdAt' timestamp.
   * @param {string} residence - Residence hall to query for.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listByResidence({ residence, skip = 0, limit = 50, blockedMe = [], deleted = false } = {}) {
    return this.find({ authorResidence: residence, createdBy: { $nin: blockedMe }, $or: [{ deleted: { $exists: false } }, { deleted: deleted }, { isHidden: false }, { 'flagged.3': { $exists: false } }] })
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * List posts created by the userId passed in.
   * @param {string} userId - Id of user to collect posts for.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listByUser({ userId, skip = 0, limit = 50, deleted = false } = {}) {
    return this.find({ createdBy: userId, $or: [{ deleted: { $exists: false } }, { deleted: deleted }] })
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * List posts starred by the userId passed in.
   * @param {string} userId - Id of user to collect posts for.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listUserFavorites({ userId, skip = 0, limit = 50 } = {}) {
    return this.find({ 'starred.actedBy': userId })
      .populate(populateMap())
      .sort({ 'starred.actedAt': -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * List Events marked as going by the userId passed in.
   * @param {string} userId - Id of user to collect posts for.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listUserEvents({ userId, skip = 0, limit = 50, deleted = false } = {}) {
    return this.find({ $and: [{ $or: [{ createdBy: userId }, { 'going.actedBy': userId }] }, { $or: [{ deleted: { $exists: false } }, { deleted: deleted }] }] })
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * List posts with flags that are pending
   *
   * @returns {Promise<Post[]>}
   */
  getPendingFlaggedEvents({ skip = 0, limit = 50 } = {}) {
    return this.find({ 'flagged.actionStatus': 'Pending Review' })
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  getUserCreatedEvents(userId) {
    return this.find({ 'createdBy': userId, $or: [{ deleted: { $exists: false } }, { deleted: false }] }).populate(populateMap()).sort({ createdAt: -1 }).exec();
  },

  getUserLikedEvents(userId) {
    return this.find({ 'liked.actedBy': userId, $or: [{ deleted: { $exists: false } }, { deleted: false }] }).populate(populateMap()).sort({ 'liked.createdAt': -1 }).exec();
  },

  getUserCommentedEvents(userId) {
    return this.find({ 'comments.createdBy': userId, $or: [{ deleted: { $exists: false } }, { deleted: false }] }).populate(populateMap()).sort({ 'comments.createdAt': -1 }).exec();
  },

  listByResidenceForAdmin({ residence, skip = 0, limit = 50, event = false, sortBy = 'createdAt', asc = false, search = null } = {}) {
    var sort = {};
    sort[sortBy] = asc ? 1 : -1;
    //new RegExp(country, 'i')
    //{ $regex: residence + '^', $options: 'i' }
    let q = {};
    q.isEvent = event;
    if (search) {
      q.details = new RegExp(search, 'i');
    }
    if (['campus', 'university'].indexOf(residence.toLowerCase()) > -1) {
      q.discoveryFeed = true;
    } else {
      q.discoveryFeed = false;
      q.authorResidence = new RegExp(residence, 'i')
    }//{ authorResidence: new RegExp(residence, 'i'), isEvent: event }
    // console.log(q);
    return this.find(q)
      .populate(populateMap())
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
  },

  listByResidenceForStaff(userId, { residence, skip = 0, limit = 50, event = false, sortBy = 'createdAt', asc = false } = {}) {
    var sort = {};
    sort[sortBy] = asc ? 1 : -1;
    return this.find({ 'createdBy': userId, authorResidence: residence, isEvent: event })
      .populate(populateMap())
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
  },

  findByCustomQuery({ q = {}, skip = 0, limit = 50 } = {}) {
    return this.find(q)
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
  },
};
/**
 * @typedef BotEvent
 */
export default mongoose.model('BotEvent', BotEventSchema);
