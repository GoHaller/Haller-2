import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import universityCtrl from '../controllers/university.controller'

import { load, getToken } from '../helpers/AuthorizationHelper';
import config from '../../config/env';


const router = express.Router(); // eslint-disable-line new-cap

//admin APIS
router.route('/admin/:userId/list')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.allUsersByFilter)

  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getAllUsersWithFilter);


router.route('/admin/change-user-sataus')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.userStatus), userCtrl.toggleUserStatus);

router.route('/admin/users-for-notification')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getUserForNotification)

router.route('/admin/invite-code-status-excel')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getInviteCodeStatusExcel)
router.route('/admin/invite-code-status')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getInviteCodeStatus)
router.route('/analytics')
  .get(userCtrl.getUserAnalytics)
router.route('/botconversation')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getUsersBotConversation)
//App APIS
router.route('/university/:id')
  .get(universityCtrl.getById)

router.route('/organization')
  /** GET /api/users/organization - Get organization */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getAllOrganization)
  .post(validate(paramValidation.postOrganization), userCtrl.createOrganization);

router.route('/sendnoti/:msg')
  .get(userCtrl.sendNotification)
router.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret, getToken }), userCtrl.list)
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

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

router.route('/bot/:email')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getBotUser);

router.route('/:userId/search')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.searchPeers);

router.route('/:userId/getusesrwhotalkwith')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), userCtrl.getUsesrWhoTalkWith)

export default router;
// : (req) => {
//       if (req.headers && req.headers.authorization) {
//         return req.headers.authorization.split(':')[1];
//       }
//       return null;
