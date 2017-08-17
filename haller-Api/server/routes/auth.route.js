import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/env';
import authHelper from '../helpers/AuthorizationHelper';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/admin/login')
  .post(validate(paramValidation.login), authCtrl.adminlogin);
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/send-mail')
  .post(authCtrl.sendEmailResetPassword);

router.route('/reset-password')
  .post(authCtrl.changeUserPassword);

router.route('/encrypt/:password')
  .get(authCtrl.encryptPassword);

router.route('/:userId/report')
  .post([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), authCtrl.reportProblem])

router.route('/:userId/password')
  .put([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), authCtrl.changePassword])

router.route('/:userId/create-password')
  .put([expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), authCtrl.createPassword])

router.route('/logout/:userId')
  .get(validate(paramValidation.logout), authCtrl.logout);
/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), authCtrl.getRandomNumber);
router.route('/check-invite-code').post(authHelper.checkInviteCode);
router.route('/invite-code').get(authHelper.inviteCodeStats);
export default router;