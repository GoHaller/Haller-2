import _ from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Conversation from '../models/conversation.model';
import FCMSender from '../helpers/FCMSender';
import User from '../models/user.model';
import APIError from '../helpers/APIError';
import { load, getToken } from '../helpers/AuthorizationHelper';
import devBot from '../controllers/bot.controller';
import emailVerification from '../cronJobs/emailVerification';

const activityType = 19;

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
                    console.log('sendBotQuestionEmail res', res);
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
          (err, doc) => { if (err) { return next(err); } else if (doc) { return res.json(doc); } });
      })
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
export default { get, list, create, update, updateMessage, remove, removeMessage, leaveConversation, createBotConversation, askToBot, markConversationAsRead, replyAsBot };
