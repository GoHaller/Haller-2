import _ from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../../config/env';
import Conversation from '../models/conversation.model';
import FCMSender from '../helpers/FCMSender';
import User from '../models/user.model';
import APIError from '../helpers/APIError';
import { load, getToken } from '../helpers/AuthorizationHelper';
import devBot from '../controllers/bot.controller';
import emailVerification from '../cronJobs/emailVerification';

const activityType = 19;
// console.log('config.botEmail', config.botEmail);
function processConversationList(conversations, userId, callback) {
  for (var i = 0; i < conversations.length; i++) {
    var conversation = conversations[i];
    if (conversation.participants.length > 1) {
      var deletedFor = null;
      if (conversation.deletedFor) {
        for (var d = 0; d < conversation.deletedFor.length; d++) {
          if (conversation.deletedFor[d].user == userId) {
            deletedFor = conversation.deletedFor[d];
          }
        }
      }
      if (deletedFor) {
        for (var m = 0; m < conversation.messages.length; m++) {
          if (new Date(conversation.messages[m].createdAt).getTime() < new Date(deletedFor.at).getTime()) {
            conversation.messages.splice(m, 1);
            m--;
          }
        }
      }
      deletedFor = null;
      if (conversation.leftUser) {
        for (var d = 0; d < conversation.leftUser.length; d++) {
          if (conversation.leftUser[d].user == userId) {
            deletedFor = conversation.leftUser[d];
          }
        }
      }
      if (deletedFor && conversation.messages) {
        for (var m = 0; m < conversation.messages.length; m++) {
          if (new Date(conversation.messages[m].createdAt).getTime() > new Date(deletedFor.at).getTime()) {
            conversation.messages.splice(m, 1);
            m--;
          }
        }
      }
      if (conversation.messages.length == 0) { conversations.splice(i, 1); i-- }
    } else {
      conversations.splice(i, 1); i--;
    }
  }
  callback(conversations);
}


function processConversation(conversation, userId, callback) {
  var deletedFor = null;
  if (conversation.deletedFor) {
    for (var d = 0; d < conversation.deletedFor.length; d++) {
      if (conversation.deletedFor[d].user == userId) {
        deletedFor = conversation.deletedFor[d];
      }
    }
  }
  if (deletedFor) {
    let deletedAt = new Date(deletedFor.at);
    // console.log('deletedAt', deletedAt);
    for (var m = 0; m < conversation.messages.length; m++) {
      // console.log('createdAt', new Date(conversation.messages[m].createdAt));
      if (new Date(conversation.messages[m].createdAt).getTime() < deletedAt) {
        conversation.messages.splice(m, 1);
        m--;
      }
    }
  }
  deletedFor = null;
  if (conversation.leftUser) {
    for (var d = 0; d < conversation.leftUser.length; d++) {
      if (conversation.leftUser[d].user == userId) {
        deletedFor = conversation.leftUser[d];
      }
    }
  }
  if (deletedFor && conversation.messages) {
    for (var m = 0; m < conversation.messages.length; m++) {
      if (new Date(conversation.messages[m].createdAt).getTime() > new Date(deletedFor.at).getTime()) {
        conversation.messages.splice(m, 1);
        m--;
      }
    }
  }
  callback(conversation);
}

/**
 * get conversations by id
 * @returns {Conversation}
 */
function get(req, res, next) {
  Conversation.get(req.params.conversationId, req.params.userId || null)
    .then(convo => {
      processConversation(convo, req.params.userId, function (processedConvo) {
        res.json(processedConvo);
      });
    })
    .error(e => next(e))
    .catch((e) => {
      next(e);
    });
}

/**
 * list conversations by participant userId
 * @returns {Conversation[]}
 */
function list(req, res, next) {
  let recipient;
  if (req.query && req.query.recipient) {
    recipient = req.query.recipient;
  }
  User.userWhoBlockedMe(req.params.userId, req.query.bot || false)
    .then(usersWhoBlockedMe => {
      User.findOne({ '_id': req.params.userId }, { 'blocked.user': 1 }).exec()
        .then(bu => {
          if (bu.blocked) {
            for (var i = 0; i < bu.blocked.length; i++) {
              usersWhoBlockedMe.push({ _id: bu.blocked[i].user });
            }
          }
          Conversation.list({ userId: req.params.userId, recipient, skip: 0, limit: 50, blocked: usersWhoBlockedMe })
            .then((convos) => {
              processConversationList(convos, req.params.userId, function (processedConvo) {
                res.json(processedConvo);
              });
            })
            .error(e => { console.info('conversation controller list error in', e); next(e) })
            .catch(e => { console.info('conversation controller list catch in', e); next(e) });
        })
    })
    .error(e => { console.info('conversation controller list error', e); next(e) })
    .catch((e) => { console.info('conversation controller list catch', e); next(e) });
}

function getConversation(req, res, next) {
  const { skip = 0, limit = 10, participant = null } = req.query;
  if (participant && participant.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
    Conversation.getOneConvoByParticipent(devBot._id, participant, parseInt(skip), parseInt(limit))
      .exec((err, convo) => {
        if (err) {
          console.info('conversation controller getConversationWithBot error1', err);
          return next(err);
        }
        processConversation(convo, req.params.userId, function (processedConvo) {
          res.json(processedConvo);
        });
      })
  } else {
    const err = new APIError('Invalid participant!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  }
}

function getConversationWithBot(req, res, next) {
  const { skip = 0, limit = 10 } = req.query;
  User.findOne({ email: config.botEmail })
    .exec((err, devBot) => {
      if (err) {
        console.info('conversation controller getConversationWithBot error', err);
        return next(err);
      }
      Conversation.getOneConvoByParticipent(devBot._id, req.params.userId, parseInt(skip), parseInt(limit))
        .exec((err1, convo) => {
          if (err1) {
            console.info('conversation controller getConversationWithBot error1', err1);
            return next(err1);
          }
          res.json(convo)
        })
      //getOneConvoByParticipent(res, devBot._id, req.params.userId, parseInt(skip), parseInt(limit))
      // .then(convo => {
      //   // console.log('convo', convo)
      //   res.json(convo)
      // }).catch(err => {
      //   console.info('conversation controller getConversationWithBot error1', err);
      //   return next(err);
      // })
      // .exec((err1, convo) => {
      //   if (err1) {
      //     console.info('conversation controller getConversationWithBot error1', err1);
      //     return next(err1);
      //   }
      //   res.json(convo)
      // })
    })
}

function getOneConvoByParticipent(res, userId1, userId2, msgSkip, msgLimit) {
  // console.log('msgSkip', msgSkip);
  // console.log('msgLimit', msgLimit);

  // return new Promise((resolve, reject) => {
  Conversation.aggregate([{ $match: { $and: [{ participants: userId1 }, { participants: userId2 }] } },
  { $group: { count: { $sum: 1 }, convoCount: { $sum: 1 }, _id: null } }], (error, countObj) => {
    console.log('error', error);
    if (error) {
      console.log('conversation controller getConversationWithBot error1', error);
      return next(error);
    }
    else {
      // console.log('countObj', countObj);
      let c = countObj.count || 0;
      let sliceBtm = 0;
      if (msgSkip > c) {
        sliceBtm = msgSkip;
      } else {
        let sliceBtm = (msgSkip + msgLimit) > 0 ? 0 : ((msgSkip + msgLimit) * -1);
      }
      // console.log('sliceBtm', sliceBtm);
      Conversation.findOne({ $and: [{ participants: userId1 }, { participants: userId2 }] },
        { createdBy: 1, createdAt: 1, participants: 1, messages: { $slice: [sliceBtm, msgLimit] } })
        .exec((error1, result1) => {
          if (error1) {
            console.info('conversation controller getConversationWithBot error1', error1);
            return next(error1);
          }
          else {
            res.json(result1);
          }
        })
    }
  })
  // })
}


/*
  Create Conversation
*  @param {ObjectId} createdBy - Id of the person creating the conversation
*  @param {ObjectId[]} participants - Array of participant ids (allows group chat)
*  @param {Message[]} messages - Array containing one messages
*  @param {string} messages.$.body - body of the message
*  @param {string} messages.$.image - url to image for message
*  @param {string} messages.$.createdBy - userId of message creator
*  @param {date} messages.$.createdAt - userId of message creator
*  @param {string} messages.$.recipient - userId of message recipient
*/
function create(req, res, next) { //eslint-disable-line
  const convo = new Conversation(_.extend(req.body, {
    _id: mongoose.Types.ObjectId(), //eslint-disable-line
    createdAt: new Date()
  }));
  convo.save().then((savedConvo) => {
    savedConvo.populate([{
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
    }], (err, doc) => {
      if (err) {
        return next(err);
      } else if (doc) {
        return res.json(doc);
      }
      const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
      return next(error);
    });
  });
}

/*
  Update Conversation
*  @param {ObjectId} participant - participant id to add to the chat
*  @param {Message} message - message to add
*  @param {string} message.body - body of the message
*  @param {string} message.image - url to image for message
*  @param {string} message.giphy - url to image for message
*  @param {string} message.createdBy - userId of message creator
*  @param {date} message.createdAt - userId of message creator
*  @param {string} message.recipient - userId of message recipient
*/
function update(req, res, next) { //eslint-disable-line
  if (req.params.conversationId) {
    Conversation.get(req.params.conversationId, null).then((convo) => {
      const savedConvo = convo;
      if (req.body.message) {
        savedConvo.messages.push(req.body.message);
        savedConvo.updatedAt = new Date();
      }
      if (req.body.particpant) {
        savedConvo.participants.push(req.body.participant);
        savedConvo.updatedAt = new Date();
      }
      if (req.body.groupName) {
        savedConvo.groupName = req.body.groupName;
      }
      if (req.body.notificationFor) {
        if (!savedConvo.notificationOffFor) savedConvo.notificationOffFor = [];
        var userExist = savedConvo.notificationOffFor.filter(item => {
          return item.user.toString() == req.body.notificationFor;
        })
        if (userExist.length == 0 && !req.body.off)
          savedConvo.notificationOffFor.push({ 'user': req.body.notificationFor, from: new Date() })
        else if (req.body.off) {
          var index = savedConvo.notificationOffFor.indexOf(userExist);
          savedConvo.notificationOffFor.splice(index, 1);
        }
      }
      savedConvo.save().then((sConvo) => {
        if (req.params.userId) {
          //for new app
          Conversation.get(req.params.conversationId, req.params.userId || null).then((convo2) => {
            if (req.body.message) {
              FCMSender.sendMsgNotification(req.body.message, convo2);
            }
            processConversation(convo2, req.params.userId, function (processedConvo) {
              return res.json(processedConvo);
            });
            // return res.json(convo2);
          }).catch(e => {
            console.info('Conversation.get error', e);
            const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
            return next(error);
          });
        }
        else {
          //for old app
          sConvo.populate([{
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
          }], (err, doc) => {
            if (err) {
              return next(err);
            } else if (doc) {
              return res.json(doc);
            }
            const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
            return next(error);
          });
        }
      });
    });
  } else {
    const err = new APIError('Invalid Request - missing conversationId route param', httpStatus.BAD_REQUEST);
    return next(err);
  }
}


/*
  Create Conversation
*  @param {ObjectId} createdBy - Id of the person creating the conversation
*  @param {ObjectId[]} participants - Array of participant ids (allows group chat)
*  @param {Message[]} messages - Array containing one messages
*  @param {string} messages.$.body - body of the message
*  @param {string} messages.$.image - url to image for message
*  @param {string} messages.$.createdBy - userId of message creator
*  @param {date} messages.$.createdAt - userId of message creator
*  @param {string} messages.$.recipient - userId of message recipient
*  @param {string} accessToken - bot access token
*/
function createBotConversation(req, res, next) { //eslint-disable-line
  let message = req.body.messages[0];
  let id = mongoose.Types.ObjectId();
  devBot.sendText(req.body.accessToken, id.toString(), message['body'], (error, response) => {
    console.log('devBot.sendText error', error)
    let messagesObj = {
      createdBy: message.recipient,
      createdAt: new Date(),
      recipient: message.createdBy,
    }
    if (error) {
      messagesObj['body'] = 'Sorry sir! Cherry need a doctor right now.';
    }
    else {
      messagesObj['botBody'] = response
    }
    req.body.messages.push(messagesObj);

    Conversation.list({ userId: message.createdBy, recipient: message.recipient, skip: 0, limit: 50, blocked: [] })
      .then((convos) => {
        const convoExist = convos[0];
        if (convoExist) {
          for (let i = 0; i < req.body.messages.length; i++) {
            convoExist.messages.push(req.body.messages[i]);
          }

          convoExist.updatedAt = new Date();
          convoExist.save().then((sConvo) => {
            sConvo.populate([{
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
            }], (err, doc) => {
              if (err) {
                return next(err);
              } else if (doc) {
                if (response.result.action == 'fallback') {
                  emailVerification.sendBotQuestionEmail(doc.createdBy, req.body.message['body'])
                    .then((res) => {
                      console.log('sendBotQuestionEmail res', res.success);
                    }, error => {
                      console.log('sendBotQuestionEmail error', error);
                    }).catch(err => {
                      console.log('sendBotQuestionEmail catch error', err);
                    })
                }
                return res.json(doc);
              }
            });
            // return res.json(sConvo);
          }).catch(e => {
            console.info('Conversation.get error', e);
            const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
            return next(error);
          });
        }
        else {
          const convo = new Conversation(_.extend(req.body, {
            _id: id, //eslint-disable-line
            createdAt: new Date()
          }));
          convo.save().then((savedConvo) => {
            savedConvo.populate([{
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
            }], (err, doc) => {
              if (err) {
                return next(err);
              } else if (doc) {
                return res.json(doc);
              }
              const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
              return next(error);
            });
          });
        }
      });
  });
}

/*
  Update Conversation
*  @param {ObjectId} participant - participant id to add to the chat
*  @param {Message} message - message to add
*  @param {string} message.body - body of the message
*  @param {string} message.image - url to image for message
*  @param {string} message.giphy - url to image for message
*  @param {string} message.createdBy - userId of message creator
*  @param {date} message.createdAt - userId of message creator
*  @param {string} message.recipient - userId of message recipient
*  @param {string} accessToken - bot access token
*/
function askToBot(req, res, next) {
  if (req.params.conversationId) {
    Conversation.get(req.params.conversationId, null).then((convo) => {
      const savedConvo = convo;
      if (req.body.message) {
        if (!req.body.message.createdAt) req.body.message.createdAt = new Date();
        savedConvo.messages.push(req.body.message);
        savedConvo.updatedAt = new Date();
      }
      devBot.sendText(req.body.accessToken, savedConvo._id, req.body.message['body'], (error, response) => {
        let messagesObj = {
          createdBy: req.body.message.recipient,
          createdAt: new Date(),
          recipient: req.body.message.createdBy,
        }
        if (error) {
          messagesObj['body'] = 'Sorry sir! Bot need a doctor right now.';
        }
        else {
          messagesObj['botBody'] = response
        }
        savedConvo.messages.push(messagesObj);
        savedConvo.updatedAt = new Date();
        savedConvo.save().then((sConvo) => {
          sConvo.populate([{
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
          }], (err, doc) => {
            if (err) {
              return next(err);
            } else if (doc) {
              console.log('response.result.action', response.result.action);
              if (response.result.action == 'fallback') {
                emailVerification.sendBotQuestionEmail(doc.createdBy, req.body.message['body'])
                  .then((res) => {
                    console.log('sendBotQuestionEmail res', res.success);
                  }, error => {
                    console.log('sendBotQuestionEmail error', error);
                  }).catch(err => {
                    console.log('sendBotQuestionEmail catch error', err);
                  })
              }
              return res.json(doc);
            }
          });
          // return res.json(sConvo);
        }).catch(e => {
          console.info('Conversation.get error', e);
          const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
          return next(error);
        });;
      })
    })
  } else {
    const err = new APIError('Invalid Request - missing conversationId route param', httpStatus.BAD_REQUEST);
    return next(err);
  }
}

function replyAsBot(req, res, next) {
  if (req.params.conversationId) {
    Conversation.get(req.params.conversationId, null).then((convo) => {
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
          sConvo.populate([{ path: 'createdBy', model: 'User' },
          { path: 'messages.createdBy', model: 'User', },
          { path: 'messages.recipient', model: 'User', },
          { path: 'participants', model: 'User' }],
            (err, doc) => {
              if (err) { return next(err); } else if (doc) {
                res.json(doc);
                doc.participants.forEach((participant) => {
                  if (participant.email == 'dev.bot@ku.edu')
                    messagesObj.createdBy = participant._id;
                });
                FCMSender.sendMsgNotification(messagesObj, doc);
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
}

/*
  Update Message in Conversation
*  @param {ObjectId} messageId - messageId to update
*  @param {ObjectId} conversationId - conversationId the meesage belongs to
*  @param {Message} message - message to update
*  @param {string} message.body - body of the message
*  @param {string} message.image - url to image for message
*/
function updateMessage(req, res, next) { //eslint-disable-line
  if (req.params.conversationId && req.params.messageId) {
    Conversation.get(req.params.conversationId).then((convo) => { //eslint-disable-line
      const savedConvo = convo;
      const message = savedConvo.messages.id(req.params.messageId);
      if (req.body.message) {
        if (req.body.message.body) {
          message.body = req.body.message.body;
          savedConvo.updatedAt = new Date();
        }
        if (req.body.message.image) {
          message.image = req.body.message.image;
          savedConvo.updatedAt = new Date();
        }
        if (req.body.message.read && req.body.userId) {
          if (!message.readBy) message.readBy = [];
          message.readBy.push({ user: req.body.userId, at: new Date() })
          message.read = true;
        }

        savedConvo.save().then((sConvo) => {
          if (req.body.userId) {
            Conversation.get(req.params.conversationId, req.body.userId).then((gotConvo) => {
              // return res.json(gotConvo);
              processConversation(gotConvo, req.params.userId, function (processedConvo) {
                return res.json(processedConvo);
              });
            });
          } else {
            if (sConvo) {
              processConversation(sConvo, req.params.userId, function (processedConvo) {
                return res.json(processedConvo);
              });
              // return res.json(sConvo);
            } else {
              const err = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
              return next(err);
            }
          }

        });
      } else {
        const err = new APIError('Invalid Request - No message body to update',
          httpStatus.BAD_REQUEST);
        return next(err);
      }
    });
  } else {
    const err = new APIError('Invalid Request - missing conversationId or messageId route param',
      httpStatus.BAD_REQUEST);
    return next(err);
  }
}
/*
  Remove Message from Conversation
*  @param {ObjectId} messageId - messageId to remove
*  @param {ObjectId} conversationId - conversationId the meesage belongs to
*/
function removeMessage(req, res, next) { //eslint-disable-line
  if (req.params.conversationId && req.params.messageId) {
    Conversation.get(req.params.conversationId).then((convo) => { //eslint-disable-line
      convo.messages.id(req.params.messageId).remove();
      convo.save().then((sConvo) => {
        if (sConvo) {
          processConversation(sConvo, req.params.userId, function (processedConvo) {
            return res.json(processedConvo);
          });
          // return res.json(sConvo);
        }
        const err = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
        return next(err);
      });
    });
  } else {
    const err = new APIError('Invalid Request - missing conversationId or messageId route param',
      httpStatus.BAD_REQUEST);
    return next(err);
  }
}

function markConversationAsRead(req, res, next) {
  Conversation.get(req.params.conversationId).then((convo) => {
    const savedConvo = convo;
    let activationToken = getToken(req);
    // console.log('activationToken', activationToken);
    User.findOne({ 'status.activeToken': activationToken })
      .then((user) => {
        // console.log('user', user);
        if (user) {
          savedConvo.messages.forEach(function (msg) {
            if (msg.createdBy._id.toString() != user._id.toString()) {
              let massagesRead = msg.readBy.filter(reader => {
                return reader.user.toString() == user._id.toString();
              })
              if (!massagesRead || massagesRead.length == 0) {
                msg.readBy.push({ user: user._id, at: new Date() });
                msg.read = true;
              }
            }
          });
          // console.log('savedConvo.messages',savedConvo.messages)
          savedConvo.save().then((sConvo) => {
            Conversation.get(req.params.conversationId, user._id).then((gotConvo) => {
              processConversation(gotConvo, req.params.userId, function (processedConvo) {
                return res.json(processedConvo);
              });
            });
          });
        } else {
          const error = new APIError('No such user exists!', httpStatus.NOT_FOUND);
          return next(error);
        }
      }).catch(e => {
        console.info('markConversationAsRead error', e);
        const error = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return next(error);
      });
  }).catch(e => {
    console.info('markConversationAsRead error', e);
    const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND);
    return next(error);
  });
}

/**
 * Remove conversation.
 * @returns {Conversation}
 */
function remove(req, res, next) {
  Conversation.get(req.params.conversationId)
    .then((convo) => {
      // convo.remove()
      if (!convo.deletedFor) convo.deletedFor = [];
      convo.deletedFor.push({ user: req.params.userId, at: new Date() })
      convo.save()
        .then(deletedConvo => res.json(deletedConvo))
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

function leaveConversation(req, res, next) {
  if (req.params.conversationId && req.params.userId) {
    Conversation.get(req.params.conversationId, null).then((convo) => {
      if (!convo.leftUser) convo.leftUser = [];
      convo.leftUser.push({ user: req.params.userId, at: new Date() })
      convo.save()
        .then(leftConvo => res.json(leftConvo))
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
  } else {
    const err = new APIError('Invalid Request - missing conversationId route param', httpStatus.BAD_REQUEST);
    return next(err);
  }
}

function createNotification(actObj) {
  console.info('actObj', actObj);
  Post.get(actObj.post).then(post => {
    if (actObj.createdBy != post.createdBy._id) {
      Notification.getByPostAndType(actObj.activityType, actObj.post)
        .then(notification => {
          if (notification) {
            var recipient = _.filter(notification.recipients, function (item) {
              return item.user.toString() == post.createdBy._id.toString();
            })[0];
            if (recipient) {
              recipient.read = false;
              notification.updatedAt = new Date();
              notification.save().then(savedNoti => {
                // console.info('savedNoti', savedNoti);
              }).catch(e => {
                console.info('savedNoti error', e);
              });
            }
          } else {
            var notiObje = { _id: mongoose.Types.ObjectId(), conversation: actObj.conversation, type: actObj.activityType, recipients: [{ user: post.createdBy._id }], createdBy: actObj.createdBy };
            var notification = new Notification(notiObje);
            notification.save().then(savedNoti => {
              // console.info('1 savedNoti', savedNoti);
            }).catch(e => {
              console.info('1 savedNoti error', e);
            });
          }
        }).catch(e => {
          console.info('getByPostAndType error', e);
        })
    } else {
      console.info('same user for', post._id);
    }
  }).catch(e => {
    console.info('Post.get error', e);
  })
}

function botMassReply(req, res, next) {
  if (!req.body.allStudent || req.body.allStudent || req.body.residence) {
    var q = { role: 'student' };
    if (req.body.residence) {
      q.residence = req.body.residence;
    }
    User.find(q, { _id: 1 }).exec((err, result) => {
      let messagesObj = {
        createdBy: req.body.createdBy,
        createdAt: new Date(),
        botBody: req.body.body
      }
      res.json({ success: true, user: result });
      var email = 'dev.bot@ku.edu';// + domain;, facebook: 1
      User.findOne({ email: email, role: 'bot' }, { _id: 1 })
        .then(bot => {
          sendBotMessagesToUsersForLoop(bot, result, messagesObj, 0);
        });
    })
  } else {
    res.json({ success: false });
  }
}

function sendBotMessagesToUsersForLoop(bot, users, msgObj, index) {
  var convoPopulatePath = [{ path: 'createdBy', model: 'User' }, { path: 'messages.createdBy', model: 'User', },
  { path: 'messages.recipient', model: 'User', }, { path: 'participants', model: 'User' }];
  msgObj['recipient'] = users[index]._id;
  Conversation.findOne({ $and: [{ participants: users[index]._id }, { participants: bot._id }] })
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
              FCMSender.sendMsgNotification(msgObj, doc);
            }
          });
        })
      } else {
        var convoObj = {
          messages: [msgObj],
          createdAt: new Date(),
          createdBy: bot._id,
          participants: [bot._id, users[index]._id]
        }
        const convo = new Conversation(_.extend(convoObj, { _id: mongoose.Types.ObjectId() }));
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
              FCMSender.sendMsgNotification(msgObj, doc);
            }
          });
        })
      }
    })
}

export default {
  get, list, create, update, updateMessage, remove, removeMessage, leaveConversation,
  createBotConversation, askToBot, markConversationAsRead, replyAsBot, getConversation, getConversationWithBot,
  botMassReply
};
