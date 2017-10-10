import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import botuserCtrl from '../controllers/bot-app-user.controller';
import botConvoCtrl from '../controllers/bot-app-conversation.controller';
import botNotiCtrl from '../controllers/bot-app-notification.controller';
import botEventCtrl from '../controllers/bot-app-event.controller';
import config from '../../config/env';
import { getToken } from '../helpers/AuthorizationHelper';

const router = express.Router();

//Authentication APi start
router.route('/health-check')
  .get((req, res, next) => { res.json({ success: true }) });

router.route('/feedback/:userId')
  .post(validate(paramValidation.feedback), botuserCtrl.feedback);

router.route('/report-problem/:userId')
  .post(validate(paramValidation.problemReport), botuserCtrl.problem);

router.route('/login')
  .post(validate(paramValidation.login), botuserCtrl.login);

router.route('/adminlogin').post(validate(paramValidation.login), botuserCtrl.adminlogin);

router.route('/logout/:userId')
  .get(botuserCtrl.logout);

router.route('/change-password')
  .post(validate(paramValidation.changePassword), botuserCtrl.changePassword);

router.route('/users')
  .post(validate(paramValidation.createBotUser), botuserCtrl.create)
  .put(validate(paramValidation.updateBotUser), botuserCtrl.update)
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botuserCtrl.searchUser)

router.route('/users/:userId')
  /** GET /api/users/:userId - Get user */
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), botuserCtrl.getById])

  
router.route('/users/users-for-notification')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botuserCtrl.getForNotification)

//for user analytics

router.route('/users/useranalytics').get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botuserCtrl.getUserAnalytics)

//Authentication APi end

//ChatBot APi start
router.route('/')
  .get(botuserCtrl.getBotUser);

router.route('/convo/mass-reply')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botConvoCtrl.massReply);

router.route('/convo/:userId')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botConvoCtrl.getByCreater)
  .post(botConvoCtrl.asktoBot);

router.route('/convo/reply/:conversationId')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botConvoCtrl.replyAsBot);
//ChatBot APi end


router.route('/notification/createnew')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botNotiCtrl.createUniversityNotification);

router.route('/notification/for/:userId')
  .get(botNotiCtrl.getForMe);

router.route('/notification/by/:userId')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),botNotiCtrl.getByMe);


//Event Api start
router.route('/events')
  .post(botEventCtrl.create);

router.route('/events/:userId/mine')
  /** GET /api/events/:userId/mine - User Events */
  .get(botEventCtrl.userEvents);

router.route('/events/:eventId/going')
  /** POST /api/posts/:postId/flags - Flag post */
  .post(botEventCtrl.goingEvent);

router.route('/events/:eventId/going/:goingId')
  /** DELETE /api/posts/:postId/flags/:flagId - Remove flag from post */
  .delete(botEventCtrl.deleteGoingEvent);

router.route('/events/:eventId')
  .put(botEventCtrl.update)
  .delete(botEventCtrl.remove);

router.route('/events/:userId/feeds/:feed')
  /** GET /api/users/:userId/feeds/:feed - Get posts for specific feeds */
  .get(botEventCtrl.listByFeed);
//Event Api end

export default router;
