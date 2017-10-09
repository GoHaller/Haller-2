import _ from 'lodash';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../helpers/APIError';
import BotUser from '../models/bot-users.model';
import BotConversation from '../models/bot-conversation.model';
import devBot from '../controllers/bot.controller';
import FCMSender from '../helpers/FCMSender';

var botConvoCtrl = {
  getByCreater: (req, res, next) => {
    BotConversation.findOne({ createdBy: req.params.userId })
      .populate([{ path: 'messages.createdBy', model: 'BotUser' }])
      .exec((error, result) => { res.json(result); });
  },
  asktoBot: (req, res, next) => {
    // req.body = { message: '', createdBy: '', conversationId: '', participant: '', accessToken: '' }//participant is bot id
    var message = { body: req.body.message, createdBy: req.body.createdBy, createdAt: new Date() }

    if (req.body.conversationId) {
      BotConversation.get(req.body.conversationId)
        .then(convo => {
          const copyConvo = convo;
          copyConvo.messages.push(message);
          devBot.sendText(req.body.accessToken, req.body.conversationId, req.body.message, (error, response) => {

            if (error) { response = 'Sorry! Bot need a doctor right now.' }
            var botMessage = { botBody: response, createdBy: req.body.participant, createdAt: new Date() }
            copyConvo.messages.push(botMessage);

            copyConvo.save().then((doc) => {
              if (doc) { return res.json(doc); }
              else { const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND); return next(error); }
            });
          });
        }, error => {
          console.log('asktoBot error', error);
          const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
          return next(err);
        })
    } else {
      var convoObj = {
        _id: mongoose.Types.ObjectId(), participants: [req.body.createdBy, req.body.participant],
        messages: [message], createdAt: new Date(), createdBy: req.body.createdBy, type: 'bot'
      }

      devBot.sendText(req.body.accessToken, convoObj._id.toString(), req.body.message, (error, response) => {

        if (error) { response = 'Sorry! Bot need a doctor right now.' };
        var botMessage = { botBody: response, createdBy: req.body.participant, createdAt: new Date() }
        convoObj.messages.push(botMessage);
        const convo = new BotConversation(convoObj);

        convo.save().then((doc) => {
          if (doc) { return res.json(doc); }
          else { const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND); return next(error); }
        });
      });
    }
  },
  getByParticipants: (req, res, next) => {
    BotConversation.findOne({ participants: req.params.userId })
      .populate([{ path: 'createdBy', model: 'BotUser' }])
      .exec((error, result) => { res.json(result); });
  },
  replyAsBot: (req, res, next) => {
    if (req.params.conversationId) {
      BotConversation.get(req.params.conversationId, null).then((convo) => {
        if (convo) {
          const savedConvo = convo;
          let messagesObj = {
            createdBy: req.body.createdBy,
            createdAt: new Date(),
            recipient: req.body.recipient,
            botBody: req.body.body
          }
          savedConvo.messages.push(messagesObj);
          savedConvo.updatedAt = new Date();
          savedConvo.save().then((sConvo) => {
            sConvo.populate([{ path: 'createdBy', model: 'BotUser' },
            { path: 'messages.createdBy', model: 'BotUser', },
            { path: 'messages.recipient', model: 'BotUser', },
            { path: 'participants', model: 'BotUser' }],
              (err, doc) => {
                if (err) { return next(err); } else if (doc) {
                  res.json(doc);
                  doc.participants.forEach((participant) => {
                    if (participant.email == 'dev.bot@ku.edu')
                      messagesObj.createdBy = participant._id;
                  });
                  //FCMSender.sendMsgNotification(messagesObj, doc);
                  FCMSender.sendBotMsgNotification(messagesObj, doc);
                }
              });
          })
        } else {
          const err = new APIError('Invalid Request - missing conversationId route param', httpStatus.BAD_REQUEST);
          return next(err);
        }
      }).catch(error => {
        const err = new APIError('Invalid Request - missing conversationId route param', httpStatus.BAD_REQUEST);
        return next(err);
      })
    } else {
      const err = new APIError('Invalid Request - missing conversationId route param', httpStatus.BAD_REQUEST);
      return next(err);
    }
  },
  massReply: (req, res, next) => {
    if (!req.body.allStudent || req.body.allStudent || req.body.residence) {
      var email = 'dev.bot@ku.edu';// + domain;, facebook: 1
      var q = { email: { $ne: email }, $or: [{ role: { $exists: false } }, { role: 'student' }] };
      BotUser.find(q, { _id: 1 }).exec((err, result) => {
        res.json({ success: true });
        BotUser.findOne({ email: email, role: 'bot' }, { _id: 1 })
          .then(bot => {
            let messagesObj = {
              createdBy: bot._id,
              createdAt: new Date(),
              botBody: req.body.body
            }
            sendBotMessagesToUsersForLoop(bot, result, messagesObj, 0);
          });
      })
    } else {
      res.json({ success: false });
    }
  }
}

const sendBotMessagesToUsersForLoop = function (bot, users, msgObj, index) {
  var convoPopulatePath = [{ path: 'createdBy', model: 'BotUser' }, { path: 'messages.createdBy', model: 'BotUser', },
  { path: 'messages.recipient', model: 'BotUser', }, { path: 'participants', model: 'BotUser' }];
  msgObj['recipient'] = users[index]._id;
  BotConversation.findOne({ $and: [{ participants: users[index]._id }, { participants: bot._id }] })
    .exec((err, savedConvo) => {
      if (savedConvo && savedConvo._id) {
        savedConvo.messages.push(msgObj);
        savedConvo.updatedAt = new Date();
        savedConvo.save().then((sConvo) => {
          sConvo.populate(convoPopulatePath, (err, doc) => {
            if (err) { return next(err); } else if (doc) {
              doc.participants.forEach((participant) => {
                if (participant.email == 'dev.bot@ku.edu')
                  msgObj.createdBy = participant._id;
              });
              index++;
              if (users[index])
                sendBotMessagesToUsersForLoop(bot, users, msgObj, index);
              // FCMSender.sendMsgNotification(msgObj, doc);
              FCMSender.sendBotMsgNotification(msgObj, doc);
            }
          });
        })
      } else {
        var convoObj = {
          messages: [msgObj],
          createdAt: new Date(),
          createdBy: users[index]._id,
          participants: [bot._id, users[index]._id]
        }
        const convo = new BotConversation(_.extend(convoObj, { _id: mongoose.Types.ObjectId() }));
        convo.save().then((sConvo) => {
          sConvo.populate(convoPopulatePath, (err, doc) => {
            if (err) { return console.log('sendBotMessagesToUsers', err); }
            else if (doc) {
              doc.participants.forEach((participant) => {
                if (participant.email == 'dev.bot@ku.edu')
                  msgObj.createdBy = participant._id;
              });
              index++;
              if (users[index])
                sendBotMessagesToUsersForLoop(bot, users, msgObj, index);
              //FCMSender.sendMsgNotification(msgObj, doc);
              FCMSender.sendBotMsgNotification(msgObj, doc);
            }
          });
        })
      }
    })
}

export default botConvoCtrl;
