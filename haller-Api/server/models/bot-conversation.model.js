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
    allowedTags: ['h3', 'h4', 'h5', 'h6', 'p', 'a', 'b', 'i', 'strong', 'em', 'br']
  });
}

/**
 * Message Schema
 * Represents the message object between users.
 */
const BotMessageSchema = new mongoose.Schema({
  body: {
    type: String,
    set: cleanHtml
  },
  botBody: {
    type: mongoose.Schema.Types.Mixed,
  },
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
    ref: 'BotUser',
    required: true
  },
});

/**
 * Message Schema
 * Represents the message object between users.
 */
const BotConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'BotUser',
    required: true,
    index: true
  }],
  messages: { type: [BotMessageSchema], required: true },
  createdAt: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'BotUser',
    required: true
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  type: {
    type: String,
    enum: ['bot', 'normal']
  },
});

BotConversationSchema.statics = {
  get(id) {
    return this.findById(id).exec().then(res => { return res; })
  },
  getByCreatedBy(userId) {
    return this.findOne({ createdBy: userId }).exec().then(res => { return res; })
  }
}

/**
 * @typedef Conversation
 */
export default mongoose.model('BotConversation', BotConversationSchema);
