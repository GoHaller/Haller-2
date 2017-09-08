import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import conversationCtrl from '../controllers/conversation.controller';
import { getToken } from '../helpers/AuthorizationHelper';
import config from '../../config/env';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/')
  /** POST /api/conversations - Create new user */
  .post(validate(paramValidation.createConversation), conversationCtrl.create);

router.route('/:conversationId/messages/:messageId')
  /** PUT /api/conversations/:conversationId/messages/:messageId - update message */
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.updateMessage), conversationCtrl.updateMessage)
  /** DELETE /api/conversations/:conversationId - delete conversation */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.removeMessage), conversationCtrl.removeMessage);

router.route('/:conversationId/leave/:userId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.leaveConversation), conversationCtrl.leaveConversation);

router.route('/:conversationId')
  /** GET /api/conversations/:conversationId - Get conversation */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.getConversation), conversationCtrl.get)
  /** PUT /api/conversations/:conversationId - update conversation */
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.updateConversation), conversationCtrl.update)
  /** DELETE /api/conversations/:conversationId - delete conversation */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.removeConversation), conversationCtrl.remove);

router.route('/:conversationId/users/:userId')
  /** GET /api/conversations/:conversationId/users/:userId - Get conversation */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.getConversation), conversationCtrl.get)
  /** DELETE /api/conversations/:conversationId - delete conversation */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.removeConversation), conversationCtrl.remove)
  /** PUT /api/conversations/:conversationId - update conversation */
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.updateConversation), conversationCtrl.update)

router.route('/:conversationId/markasread')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), conversationCtrl.markConversationAsRead);

router.route('/bot')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), conversationCtrl.createBotConversation)

router.route('/:conversationId/bot')
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), conversationCtrl.askToBot)
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), conversationCtrl.replyAsBot)

router.route('/users/:userId')
  /** GET /api/conversations/users/:userId - Get list of conversations by participant Id*/
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.listConversations), conversationCtrl.list);

export default router;
