import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import botCtrl from '../controllers/bot.controller';

import { load, getToken } from '../helpers/AuthorizationHelper';
import config from '../../config/env';


const router = express.Router(); // eslint-disable-line new-cap

router.route('/sendnoti/:msg')
  .get(userCtrl.sendNotification)
router.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret, getToken }), userCtrl.list)
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/bots')
  /** GET /api/users/bots - Get list of bots */
  .get(botCtrl.list)
  /** POST /api/users/bots - Create new Bot */
  .post(botCtrl.createBot);

router.route('/interest/:key')
  .get(expressJwt({ secret: config.jwtSecret, getToken }), userCtrl.getInterestList)
  .post(userCtrl.addInterest);

router.route('/residence/:residence')
  /** GET /api/users/:residence - Get list of users at a specific residence */
  .get(expressJwt({ secret: config.jwtSecret, getToken }), load, userCtrl.listByResidence);

router.route('/individual/:email')
  /** GET /api/users/individual/:email - Get a specific user by email address */
  .get(userCtrl.getByEmail);

router.route('/:userId/verify-email')
  .get(userCtrl.verifyUserEmail);

router.route('/:userId/verify-ra')
  .get(userCtrl.verifyUserIsRA);

router.route('/:userId/residence/:residence')
  /** GET /api/users/:userId/residence/:residence - Get list of users at a specific residence */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.listByResidenceForUser);

router.route('/:userId/list')
  /** GET /api/users/:userId/list - Get list of users */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.listForUser)


router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.getById])

  /** PUT /api/users/:userId - Update user */
  .put([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, validate(paramValidation.updateUser), userCtrl.update])

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.remove);

router.route('/:userId/activity')
  /** GET /api/users/:userId - Get user */
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.getActivities])

router.route('/:userId/notifications')
  /** GET /api/users/:userId - Get user */
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.getNotification])

router.route('/:userId/notification/:notificationId/read')
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.readNotification])

router.route('/:userId/block/:blockUserId')
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), validate(paramValidation.blockUser), load, userCtrl.blockUser]);

router.route('/:userId/blocklist')
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), userCtrl.getBlockedUsers]);



router.route('/:userId/otp/:otp')
  .get([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, userCtrl.verifyOtp])
router.route('/organization/:name')
  /** GET /api/users/organization/:name - Get organization */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.getOrganization), userCtrl.getOrganization);

router.route('/organization')
  /** GET /api/users/organization - Get organization */
  .post(validate(paramValidation.postOrganization), userCtrl.createOrganization);



export default router;
// : (req) => {
//       if (req.headers && req.headers.authorization) {
//         return req.headers.authorization.split(':')[1];
//       }
//       return null;
