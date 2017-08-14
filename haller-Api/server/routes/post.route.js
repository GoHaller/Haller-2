import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import config from '../../config/env';
import paramValidation from '../../config/param-validation';
import postCtrl from '../controllers/post.controller';

import { load, getToken } from '../helpers/AuthorizationHelper';

const router = express.Router(); // eslint-disable-line new-cap

//admin APIS
router.route('/admin/:userId/residence/:residence')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.listByResidence),
  postCtrl.adminListByResidence);

router.route('/admin/flagged/:section/:sort')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.adminGetFlagedPost);

router.route('/admin/:postId/flagaction')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.adminFlagAction);

router.route('/admin/:postDays/getpostcount')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.getTotalCountAnalytics);


router.route('/admin/desboard/count')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.adminDashboardCount);

router.route('/admin/desboard/eventjoiners/:days')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.getJoinDetails);

router.route('/admin/desboard/staffeventjoiners/:days')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.getStaffJoinDetails);

router.route('/admin/:postId/deletepost')
  .delete(expressJwt({
     secret: config.jwtSecret,
     getToken  
  }),postCtrl.deletePost)

  
// router.route('/admin/hide/:postId/comment/:commentId')
//App APIS

router.route('/')
  /** GET /api/posts - Get list of posts */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), postCtrl.list)

  /** POST /api/posts - Create new post */
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.createPost), postCtrl.create);
router.route('/library')
  /** POST /api/posts/library - Create new library method */
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.addLibraryItem), postCtrl.addStandAloneLibraryItem);
router.route('/library/:libraryId')
  /** POST /api/posts/library - Create new library method */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.deleteStandAloneLibraryItem), postCtrl.removeStandAloneLibraryItem);

router.route('/library/:userId')
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.libraryList), postCtrl.listLibraryItems);


router.route('/:postId/comments')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.comment),
  postCtrl.addCommentToPost);

router.route('/:postId/comments/:commentId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.unComment),
  postCtrl.removeCommentFromPost)

router.route('/admin/:postId/comments/:commentId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.unComment),
  postCtrl.deleteComment)
  

  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.updateComment),
  postCtrl.updateCommentOnPost);

router.route('/:postId/comments/:commentId/flags')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.flagCommentOnPost),
  postCtrl.flagCommentOnPost);

router.route('/:postId/comments/:commentId/flags/:flagId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.unFlagCommentOnPost),
  postCtrl.removeFlagFromComment);

router.route('/:postId/flags')
  /** POST /api/posts/:postId/flags - Flag post */
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.flagPost), postCtrl.flagPost);

router.route('/:postId/flags/:flagId')
  /** DELETE /api/posts/:postId/flags/:flagId - Remove flag from post */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.unFlagPost), postCtrl.unFlagPost);

router.route('/:postId/comments/:commentId/stars')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.starCommentOnPost),
  postCtrl.starCommentOnPost);

router.route('/:postId/comments/:commentId/stars/:starId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.unStarCommentOnPost),
  postCtrl.removeStarFromComment);

router.route('/:postId/comments/:commentId/likes')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.likeCommentOnPost),
  postCtrl.likeCommentOnPost);

router.route('/:postId/comments/:commentId/likes/:likeId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.unLikeCommentOnPost),
  postCtrl.removeLikeFromComment);

router.route('/:postId/likes')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }),
  validate(paramValidation.likePost), postCtrl.likePost);

router.route('/:postId/likes/:likeId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }),
  validate(paramValidation.unlikePost), postCtrl.unlikePost);

router.route('/:postId/stars')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }),
  validate(paramValidation.starPost), postCtrl.starPost);

router.route('/:postId/stars/:starId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }),
  validate(paramValidation.unstarPost), postCtrl.unstarPost);

router.route('/:postId/cover')
  .post(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }),
  validate(paramValidation.addLibraryItem), postCtrl.addLibraryItem);

router.route('/:postId/cover/:libraryId')
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }),
  validate(paramValidation.removeLibraryItem), postCtrl.removeLibraryItem);

router.route('/residence/:residence')
  /** GET /api/posts/residence/:residence - Get list of users at a specific residence */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }), validate(paramValidation.listByResidence),
  postCtrl.listByResidence);

router.route('/:postId')
  /** GET /api/posts/:postId - Get Post */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.getPost), postCtrl.get)

  /** PUT /api/posts/:postId - Update post */
  .put(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.updatePost), postCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({
    secret: config.jwtSecret,
    getToken
  }),
  validate(paramValidation.removePost), postCtrl.remove);


router.route('/:userId/feeds/:feed')
  /** GET /api/users/:userId/feeds/:feed - Get posts for specific feeds */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), validate(paramValidation.listByFeed), load, postCtrl.listByFeed);
router.route('/:userId/favorites')
  /** GET /api/posts/:userId/favorites - Get posts starred by a specific user */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, validate(paramValidation.listByUser), postCtrl.listUserFavorites);

router.route('/users/:userId')
  /** GET /api/posts/users/:userId - Get posts by a specific user */
  .get(expressJwt({
    secret: config.jwtSecret,
    getToken: (req) => {
      if (req.headers && req.headers.authorization) {
        return req.headers.authorization.split(':')[1];
      }
      return null;
    }
  }), load, validate(paramValidation.listByUser), postCtrl.listByUser);

// /** Load user when API with userId route parameter is hit */
// router.param('userId', load);

export default router;
