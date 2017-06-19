import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import eventRoutes from './event.route';
import convoRoutes from './conversation.route';
import notificationRoutes from './notification.route';

const router = express.Router(); // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);
// mount user routes at /users
router.use('/users', userRoutes);
// mount posts routes at /posts
router.use('/posts', postRoutes);
router.use('/events', eventRoutes);
router.use('/conversations', convoRoutes);
router.use('/notifications', notificationRoutes);
// mount auth routes at /auth
router.use('/auth', authRoutes);
// router.use('/organization', authRoutes);


export default router;
