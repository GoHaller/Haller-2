// import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
// import emailVerification from '../cronJobs/emailVerification';
const apiai = require('apiai');

// const config = require('../../config/env');
const bcrypt = require('bcryptjs');
const accessToken = 'b9a1ce6b0a764de6801ecda3960539ba';
/**
 * @param conversationId
 * @param message
 * @param callback
 * @returns {*}
 */
// function sendText(conversationId, botUser, message, callback) {
// var bot = apiai(botUser.botData.accessToken);
function sendText(conversationId, message, callback) {
  var bot = apiai(accessToken);
  // console.log('message', message);

  var request = bot.textRequest(message, { sessionId: conversationId });

  request.on('response', (response) => {
    // console.log('response', response);
    callback(null, response);
  });

  request.on('error', (error) => {
    console.log('error', error);
    callback(error, null);
  });

  request.end();
}

function createBot(req, res, next) {
  const user = new User({
    _id: mongoose.Types.ObjectId(), //eslint-disable-line
    email: 'apiaisupport@haller.com',
    password: req.body.token ? bcrypt.hashSync(req.body.token, 10) : '',
    status: {
      online: true,
      lastOnline: new Date(),
      currentStatus: 'online',
    },
    isBot: true,
    botData: {
      description: req.body.description,
      accessToken: req.body.token
    },
    emailVerified: true
  });
  user.save().then((sBot) => {
    return res.json(sBot);
  }).catch((err) => {
    console.log('bot.create error', err);
    const error = new APIError('Could not create Bot!', httpStatus.NOT_FOUND);
    return next(error);
  });
}

function list(req, res, next) {
  User.listBots()
    .then(users => res.json(users))
    .catch((e) => {//eslint-disable-line
      return next(e);
    });
}

export default { sendText, createBot, list };
