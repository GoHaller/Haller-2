import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import notificationCtrl from '../controllers/notification.controller';
import { getToken } from '../helpers/AuthorizationHelper';
import config from '../../config/env';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/notifications - Create new notification */
  .post(validate(paramValidation.createNotification), notificationCtrl.create);

router.route('/:notificationId')
  /** GET /api/notifications/:notificationId - Get notification */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.getNotification), notificationCtrl.get)
  /** PUT /api/notifications/:notificationId - update notification */
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.updateNotification), notificationCtrl.update)
  /** DELETE /api/notifications/:notificationId - delete notification */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.removeNotification), notificationCtrl.remove);

router.route('/users/:userId')
  /** GET /api/notifications/users/:userId - Get list of notifications by participant Id*/
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.listNotifications), notificationCtrl.list);

export default router;
