import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import botuserCtrl from '../controllers/bot-app-user.controller';
import botConvoCtrl from '../controllers/bot-app-conversation.controller';
import botNotiCtrl from '../controllers/bot-app-notification.controller';
import config from '../../config/env';
import authHelper from '../helpers/AuthorizationHelper';

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

router.route('/logout/:userId')
  .get(botuserCtrl.logout);

router.route('/change-password')
  .post(validate(paramValidation.changePassword), botuserCtrl.changePassword);

router.route('/users')
  .post(validate(paramValidation.createBotUser), botuserCtrl.create)
  .put(validate(paramValidation.updateBotUser), botuserCtrl.update)
  .get(botuserCtrl.searchUser)

router.route('/users/users-for-notification')
  .get(botuserCtrl.getForNotification)
//Authentication APi end

//ChatBot APi start
router.route('/')
  .get(botuserCtrl.getBotUser);

router.route('/convo/mass-reply')
  .post(botConvoCtrl.massReply);

router.route('/convo/:userId')
  .get(botConvoCtrl.getByCreater)
  .post(botConvoCtrl.asktoBot);

router.route('/convo/reply/:conversationId')
  .post(botConvoCtrl.replyAsBot);
//ChatBot APi end


router.route('/notification/create')
  .get(botNotiCtrl.createUniversityNotification);

router.route('/notification/for/:userId')
  .get(botNotiCtrl.getForMe);

router.route('/notification/by/:userId')
  .get(botNotiCtrl.getByMe);

export default router;
