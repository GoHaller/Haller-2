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
 * Message Schema
 * Represents the message object between users.
 */
const MessageSchema = new mongoose.Schema({
  body: {
    type: String,
    set: cleanHtml
  },
  botBody: {
    type: mongoose.Schema.Types.Mixed,
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  deletedFor: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    at: { type: Date, default: new Date() }
  }],
  readBy: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    at: { type: Date, default: new Date() }
  }],
  read: {
    type: Boolean,
    default: false,
  },
  image: {
    type: mongoose.Schema.Types.Mixed, // this will hold the Cloudinary link to the image.
  },
  giphy: {
    id: { type: mongoose.Schema.Types.Mixed },
    still: { type: mongoose.Schema.Types.Mixed },
    gif: { type: mongoose.Schema.Types.Mixed }
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
/*
  Map of paths to populate for mongoose.populate method
*/
const populateMap = () =>
  [{
    path: 'createdBy',
    model: 'User'
  }, {
    path: 'messages.createdBy',
    model: 'User',
  }, {
    path: 'messages.recipient',
    model: 'User',
  }, {
    path: 'participants',
    model: 'User'
  }];

/**
 * Message Schema
 * Represents the message object between users.
 */
const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }],
  notificationOffFor: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    from: { type: Date, default: new Date() }
  }],
  deletedFor: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    at: { type: Date, default: new Date() }
  }],
  leftUser: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    at: { type: Date, default: new Date() }
  }],
  messages: { type: [MessageSchema], required: true },
  createdAt: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  image: {
    type: mongoose.Schema.Types.Mixed
  },
  groupName: {
    type: String
  }
});

ConversationSchema.statics = {
  /**
   * Get a conversation by id
   * @param {ObjectId} id - The objectId of conversation.
   * @returns {Promise<Conversation, APIError>}
   */
  get(id, userId = null) {
    if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
      return this.findById(id)
        .populate(populateMap())
        .exec()
        .then((conversation) => {
          if (conversation) {
            return conversation;
            // processConversation(conversation, function (processedConvo) {
            //   return processedConvo;
            // });
          }
          const err = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        })
        .error(err => Promise.reject(err))
        .catch(err => Promise.reject(err));
    }
    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },

  /**
   * List conversations in descending order of 'createdAt' timestamp.
   * @param {ObjectId} userId - Id of the particpant to get conversations for.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Conversation[]>}
   */
  list({ userId, recipient, skip = 0, limit = 50, blocked = [] } = {}) {
    if (userId.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
      try {
        let deletedFor = { 'deletedFor.user': { $ne: userId } };
        // let q = { $and: [{ participants: { $in: [userId] } }, deletedFor] };
        // if (recipient) {
        //   q = { $and: [{ participants: userId }, { participants: recipient }, deletedFor], participants: { $size: 2 } };
        // }
        let blockMe = { participants: { $nin: blocked } };
        let q = { $and: [{ participants: userId }, blockMe] };//, { $where: "this.participants.length > 1" }] };
        if (recipient) {
          q = { $and: [{ participants: userId }, { participants: recipient }, blockMe], participants: { $size: 2 } };
        }
        return this.find(q)
          .populate(populateMap())
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec()
          .then((conversation) => {
            if (conversation) {
              return conversation;
            } else {
              return [];
            }
          })
          .error(err => Promise.reject(err))
          .catch(err => Promise.reject(err));
      } catch (exc) {
        return Promise.reject(exc);
      }
    }

    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },

  getOneConvoByParticipent(userId1, userId2, msgSkip, msgLimit) {
    let sliceBtm = (msgSkip + msgLimit) * -1;
    return this.findOne({ $and: [{ participants: userId1 }, { participants: userId2 }] },
      { createdBy: 1, createdAt: 1, participants: 1, messages: { $slice: [sliceBtm, msgLimit] } });
  }

};

/**
 * @typedef Conversation
 */
export default mongoose.model('Conversation', ConversationSchema);
