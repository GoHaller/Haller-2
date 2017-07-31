import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import emailVerification from '../cronJobs/emailVerification';
var apiai = require('apiai');

const config = require('../../config/env');
const bcrypt = require('bcryptjs');

/**
 *
 * @param conversationId
 * @param message
 * @param callback
 * @returns {*}
 */
function sendText(conversationId, botUser, message, callback) {
  var bot = apiai(botUser.botData.accessToken);
  var request = bot.textRequest(body, {
    sessionId: conversationId
  });

  request.on('response', function(response) {
    console.log(response);
    callback(response);

    return response;
  });

  request.on('error', function(error) {
    console.log(error);
    callback(null, error);

    return response;
  });
}

function createBot(req, res, next) {
  const user = new User({
    _id: mongoose.Types.ObjectId(), //eslint-disable-line
    email: "apiaisupport@haller.com",
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
  user.save().then(sBot => {
    return res.json(sBot);
  }).catch((exc) => {
    console.info('bot.create error', e);
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
