import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import botuserCtrl from '../controllers/bot-app-user.controller';
import botConvoCtrl from '../controllers/bot-app-conversation.controller';
import config from '../../config/env';
import authHelper from '../helpers/AuthorizationHelper';

const router = express.Router();

//Authentication APi start
router.route('/health-check')
  .get((req, res, next) => { res.json({ success: true }) });

router.route('/login')
  .post(validate(paramValidation.login), botuserCtrl.login);

router.route('/logout/:userId')
  .get(botuserCtrl.logout);

router.route('/change-password')
  .post(validate(paramValidation.changePassword), botuserCtrl.changePassword);

router.route('/users')
  .post(validate(paramValidation.createBotUser), botuserCtrl.create);
//Authentication APi end

//ChatBot APi start
router.route('/')
  .get(botuserCtrl.getBotUser);

router.route('/convo/:userId')
  .get(botConvoCtrl.getByCreater)
  .post(botConvoCtrl.asktoBot);
//ChatBot APi end

export default router;
