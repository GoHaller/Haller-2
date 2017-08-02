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
    ref: 'User',
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
    set: cleanHtml
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
    model: 'User'
  }, {
    path: 'comments.createdBy',
    model: 'User',
  }, {
    path: 'comments.starred.actedBy',
    model: 'User',
  }, {
    path: 'comments.flagged.actedBy',
    model: 'User',
  }, {
    path: 'liked.actedBy',
    model: 'User',
  }, {
    path: 'starred.actedBy',
    model: 'User',
  }, {
    path: 'flagged.actedBy',
    model: 'User'
  }, {
    path: 'going.actedBy',
    model: 'User'
  }, {
    path: 'cover',
    model: 'Library'
  }, {
    path: 'comments.image',
    model: 'Library'
  }
  ];

/**
 * Post Schema
 * Represents the major interaction with the system, the post object
 */
const PostSchema = new mongoose.Schema({
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
  authorResidence: {
    type: String,
    required: true
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
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
  },
  deteled: {
    type: Boolean,
    default: false,
    required: true
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
PostSchema.method({
});

/**
 * Statics
 */
PostSchema.statics = {
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
        .then((post) => {
          if (post) {
            return post;
          }
          const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        });
    }
    const err = new APIError('Invalid postId!', httpStatus.BAD_REQUEST);
    return Promise.reject(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50, deteled = false } = {}) {
    return this.find({ deteled: deteled })
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
  listByFeed({ feed = 'all', residenceHall, skip = 0, limit = 50, isEvent = null, blockedMe = [], deteled = false } = {}) {
    const q = { $or: [{ deteled: { $exists: false } }, { deteled: deteled }] };
    if (feed === 'discovery') { q.discoveryFeed = true; }
    else if (feed === 'residents' && residenceHall) {
      q.residentsFeed = true;
      q.authorResidence = residenceHall;
    } else {
      q.discoveryFeed = false;
      q.residentsFeed = false;
    }
    q.createdBy = { $nin: blockedMe };
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
  listByResidence({ residence, skip = 0, limit = 50, blockedMe = [], deteled = false } = {}) {
    return this.find({ authorResidence: residence, createdBy: { $nin: blockedMe }, $or: [{ deteled: { $exists: false } }, { deteled: deteled }] })
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
  listByUser({ userId, skip = 0, limit = 50, deteled = false } = {}) {
    return this.find({ createdBy: userId, $or: [{ deteled: { $exists: false } }, { deteled: deteled }] })
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
      .sort({ createdAt: -1 })
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
  listUserEvents({ userId, skip = 0, limit = 50, deteled = false } = {}) {
    return this.find({ $and: [{ $or: [{ createdBy: userId }, { 'going.actedBy': userId }] }, { $or: [{ deteled: { $exists: false } }, { deteled: deteled }] }] })
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
  getPendingFlaggedPosts({ skip = 0, limit = 50 } = {}) {
    return this.find({ 'flagged.actionStatus': 'Pending Review' })
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  getUserCreatedPosts(userId) {
    return this.find({ 'createdBy': userId, $or: [{ deteled: { $exists: false } }, { deteled: false }] }).populate(populateMap()).sort({ createdAt: -1 }).exec();
  },

  getUserLikedPosts(userId) {
    return this.find({ 'liked.actedBy': userId, $or: [{ deteled: { $exists: false } }, { deteled: false }] }).populate(populateMap()).sort({ 'liked.createdAt': -1 }).exec();
  },

  getUserCommentedPosts(userId) {
    return this.find({ 'comments.createdBy': userId, $or: [{ deteled: { $exists: false } }, { deteled: false }] }).populate(populateMap()).sort({ 'comments.createdAt': -1 }).exec();
  },

  listByResidenceForAdmin({ residence, skip = 0, limit = 50, event = false, sortBy = 'createdAt', asc = false } = {}) {
    var sort = {};
    sort[sortBy] = asc ? 1 : -1;
    return this.find({ authorResidence: residence, isEvent: event })
      .populate(populateMap())
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
  },

  findByCustomQuery({ q = {}, skip = 0, limit = 50 } = {}) {
    console.info('q', q);
    return this.find(q)
      .populate(populateMap())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};
/**
 * @typedef Post
 */
export default mongoose.model('Post', PostSchema);
