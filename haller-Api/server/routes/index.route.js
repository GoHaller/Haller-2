import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import eventRoutes from './event.route';
import convoRoutes from './conversation.route';
import notificationRoutes from './notification.route';
import dev from '../controllers/bot.controller';
// import Demo from '../models/demo.model';

const router = express.Router(); // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.get('/bot/:msg', (req, res) => {
  console.log('req.params', req.params);
  dev.sendText('58c88019f150f60004f0c040', req.params.msg, (error, response) => {
    if (error) res.json(error);
    else res.json(response);
  })
})
// router.get('/demo-insert/:count', (req, res) => {
//   var count = req.params.count || 100;
//   console.info('start', new Date())
//   for (var i = 1; i <= count; i++) {
//     var demo = new Demo({ name: 'kamal' + i, number: i });
//     demo.save().then(demo => {
//       // console.info('demo', demo);
//       if (demo.number == count) {
//         console.info('end', new Date())
//       }
//     }, error => {
//       // console.info('error', error);
//     })
//   }
//   res.send('started');
// })
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
