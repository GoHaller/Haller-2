import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import config from '../../config/env';
import paramValidation from '../../config/param-validation';
import eventCtrl from '../controllers/event.controller';
import { getToken } from '../helpers/AuthorizationHelper';


const router = express.Router(); // eslint-disable-line new-cap
router.route('/')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.createEvent), eventCtrl.create);

router.route('/:userId/mine')
  /** GET /api/events/:userId/mine - User Events */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.userEvents), eventCtrl.userEvents);

router.route('/:eventId/going')
  /** POST /api/posts/:postId/flags - Flag post */
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.goingEvent), eventCtrl.goingEvent);

router.route('/:eventId/going/:goingId')
  /** DELETE /api/posts/:postId/flags/:flagId - Remove flag from post */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.deleteGoingEvent), eventCtrl.deleteGoingEvent);

router.route('/:eventId')
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.updateEvent), eventCtrl.update)
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), validate(paramValidation.deleteEvent), eventCtrl.remove);


export default router;
