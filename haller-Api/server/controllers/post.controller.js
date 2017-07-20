import _ from 'lodash';
import { extend } from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Post from '../models/post.model';
import User from '../models/user.model';
import Activities from '../models/activities.model';
import Notification from '../models/notification.model';
import Library from '../models/library.model';
import APIError from '../helpers/APIError';
import FCMSender from '../helpers/FCMSender';
import { postsMap } from '../helpers/PopulateMaps';
import { sendFlaggedEmailWithMailgun } from '../cronJobs/sendFlaggedPostEmail';


/**
 * Get Post
 * @param {string} postId - _id of the post to be fetched
 * @returns {Post}
 */
function get(req, res, next) {
  Post.get(req.params.postId)
    .then(post => res.json(post))
    .error(e => next(e))
    .catch(e => next(e));
}

/**
 * Create new post
 * @property {string} req.body.email - The email address of the user.
 * @property {string} req.body.password - The password of the user.
 * @returns {User}
 */
function create(req, res, next) {
  const postBody = req.body;
  // they attached the image(s) directly in the new post.
  if (postBody.cover && postBody.cover.length > 0) {
    const covers = postBody.cover;
    delete postBody.cover;
    let coverIds = [];
    const coverObjects = [];
    _.each(covers, (cover) => {
      const lIt = new Library(_.extend(cover, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
      coverObjects.push(lIt);
    });
    Library.insertMany(coverObjects).then((saved) => { //eslint-disable-line
      coverIds = _.map(saved, item => item._id);
      postBody.cover = coverIds;
      const post = new Post(_.extend(postBody, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
      post.save()
        .then((savedPost) => {
          savedPost.populate(postsMap, (er, doc) => {
            if (er) {
              return next(er);
            }
            var act = { _id: mongoose.Types.ObjectId(), post: savedPost._id, activityType: 1, createdBy: savedPost.createdBy._id };
            createActivityLog(act, function () {
              return res.json(doc);
            });
          });
        })
        .catch((err) => {
          // console.info('err', err);
          const e = new APIError('Error Creating Post!', httpStatus.INTERNAL_SERVER_ERROR);
          next(e);
        });
    }).catch((err) => {
      console.error(err);
      return next(err);
    });
  } else {
    const post = new Post(_.extend(postBody, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
    post.save()
      .then((savedPost) => {
        savedPost.populate(postsMap, (err, doc) => {
          if (err) {
            return next(err);
          }
          var act = { _id: mongoose.Types.ObjectId(), post: savedPost._id, activityType: 1, createdBy: savedPost.createdBy._id };
          createActivityLog(act, function () {
            return res.json(doc);
          });
        });
      })
      .catch((error) => {
        console.info('error', error);
        const err = new APIError('Error Updating Post!', httpStatus.INTERNAL_SERVER_ERROR);
        next(err);
      });
  }
}

/**
 * Update existing post
 * @property {string} title - The title of the event/discover post
 * @property {string} details - The post body.
 * @property {string} cover - The photo attached to the post.
 * @property {date} date - The date for the event.
 * @property {string} time - The time of the event
 * @returns {Post}
 */
function update(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      const body = req.body;
      const updatedPost = post;
      // update the post properties from the body of the request. Avoid overwriting with blank values.
      if (body.title) {
        updatedPost.title = body.title;
      }
      if (body.details) {
        updatedPost.details = body.details;
      }
      if (body.date) {
        updatedPost.date = body.date;
      }
      if (body.time) {
        updatedPost.time = body.time;
      }
      if (body.cover) { // images are attached to the update body
        /*
          TODO refactor into a service of
          some kind that will take care of the logic around images.
        */
        const covers = body.cover;
        delete body.cover;
        let coverIds = [];
        const coverObjects = [];
        _.each(covers, (cover) => {
          const lIt = new Library(_.extend(cover, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
          coverObjects.push(lIt);
        });
        Library.insertMany(coverObjects).then((saved) => { //eslint-disable-line
          coverIds = _.map(saved, item => item._id);
          body.cover = coverIds;
          if (updatedPost.cover && updatedPost.cover.length >= 1) {
            updatedPost.cover = updatedPost.cover.concat(coverIds);
          } else {
            updatedPost.cover = coverIds;
          }
          updatedPost.updatedAt = new Date();
          updatedPost.updatedBy = body.updatedBy;
          updatedPost.save()
            .then((updatePost) => {
              updatePost.populate(postsMap, (err, doc) => {
                if (err) {
                  return next(err);
                }
                // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 2, createdBy: doc.createdBy._id };
                // createActivityLog(act, function () {
                return res.json(doc);
                // });
              });
            })
            .catch(e => next(e));
        }).catch((err) => {
          console.error(err);
          return next(err);
        });
      } else {
        updatedPost.updatedAt = new Date();
        updatedPost.updatedBy = body.updatedBy;
        // save the updates
        updatedPost.save()
          .then((updatePost) => {
            updatePost.populate(postsMap, (err, doc) => {
              if (err) {
                return next(err);
              }
              // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 2, createdBy: doc.createdBy._id };
              // createActivityLog(act, function () {
              return res.json(doc);
              // });
            });
          })
          .catch((e) => {
            next(e);
          });
      }
    });
}

/**
 * Remove cover from post
 * @param {string} postId _id of post to remove cover from
 * @param {string} coverId _id of cover
 *
 * @returns {Post}
 */
function removeCover(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      const updatedPost = post;
      const coverId = req.params.coverId;
      updatedPost.cover = _.reject(post.cover, item => item._id === coverId);
      updatedPost.save()
        .then((updPost) => {
          updPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 2, createdBy: doc.createdBy._id };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    })
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Post.list({ limit, skip })
    .then(users => res.json(users))
    .catch((e) => {
      next(e);
    });
}

/**
 * Get user list by residence.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function listByResidence(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.userWhoBlockedMe(req.params.userId).then(blockedMe => {
    Post.listByResidence({ residence: req.params.residence, limit, skip, blockedMe: blockedMe })
      .then(users => res.json(users))
      .catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

/**
 * Get user list of favorited posts/events.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function listUserFavorites(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Post.listUserFavorites({ userId: req.params.userId, limit, skip })
    .then(users => res.json(users))
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}
/**
 * Get user list by feed.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Post[]}
 */
function listByFeed(req, res, next) {
  const { limit = 50, skip = 0, event = null } = req.query;
  User.userWhoBlockedMe(req.params.userId).then(blockedMe => {
    User.get(mongoose.Types.ObjectId(req.params.userId)).then((user) => { //eslint-disable-line
      var q = {
        feed: req.params.feed,
        residenceHall: user.residence,
        limit: Number.parseInt(limit, 10),
        skip: Number.parseInt(skip, 10),
        isEvent: event,
        blockedMe: blockedMe
      }
      Post.listByFeed(q)
        .then(users => { res.json(users) })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    })
      .catch(next);
  })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}
/**
 * Get user list by residence.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function listByUser(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Post.listByUser({ userId: req.params.userId, limit, skip })
    .then(users => res.json(users))
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}
/**
 * Delete Post.
 * @returns {Post} the deleted post.
 */
function remove(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      post.deteled = true;
      post.save()
        .then((doc) => {
          // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 3, createdBy: doc.createdBy._id };
          // createActivityLog(act, function () {
          return res.json(doc);
          // });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Flag Post.
 * @returns {Post} the flagged post.
 */
function flagPost(req, res, next) {
  const flag = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType,
    actionStatus: 'Pending Review'
  };
  Post.get(req.params.postId)
    .then((post) => {
      post.flagged.push(flag);
      post.save()
        .then(updatedPost =>
          updatedPost.populate(postsMap, (e, d) =>
            //sendFlaggedEmailWithMailgun(d).then(p =>
            d.populate(postsMap, (err, doc) => {
              if (err) {
                return next(err);
              }
              // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 6, createdBy: req.body.actedBy };
              // createActivityLog(act, function () {
              return res.json(doc);
              // });
            }).catch(err => next(err))
          )
        )
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

/**
 * Un-Star Post.
 * @returns {Post} the un-starred post.
 */
function unFlagPost(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      post.flagged.id(req.params.flagId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 7, createdBy: doc.createdBy._id };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Like Post.
 * @returns {Post} the starred post.
 */
function likePost(req, res, next) {
  const like = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType
  };
  Post.get(req.params.postId)
    .then((post) => {
      post.liked.push(like);
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 4, createdBy: req.body.actedBy };
            createActivityLog(act, function () {
              return res.json(doc);
            });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

/**
 * Un-Like Post.
 * @returns {Post} the un-starred post.
 */
function unlikePost(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      var like = post.liked.id(req.params.likeId);
      post.liked.id(req.params.likeId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 5, createdBy: like.actedBy._id };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Star Post.
 * @returns {Post} the starred post.
 */
function starPost(req, res, next) {
  const star = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType
  };
  Post.get(req.params.postId)
    .then((post) => {
      post.starred.push(star);
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 8, createdBy: req.body.actedBy };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Un-Star Post.
 * @returns {Post} the un-starred post.
 */
function unstarPost(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      var star = post.starred.id(req.params.starId)
      post.starred.id(req.params.starId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 9, createdBy: star.actedBy._id };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Add Comment to Post.
 * @param {string} body -- comment body
 * @param {ObjectId} createdBy -- creating user
 * @returns {Post} the starred post.
 */
function addCommentToPost(req, res, next) {
  var image = null;
  var commentObj = {
    createdAt: req.body.createdAt,
    createdBy: req.body.createdBy,
  };
  if (req.body.giphy) {
    commentObj.giphy = req.body.giphy;
  }
  Post.get(req.params.postId)
    .then((post) => {
      if (req.body.image) {
        image = new Library(extend(req.body.image, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
        image.save().then((saved) => {
          commentObj.image = image._id;
          if (req.body.body) {
            commentObj.body = req.body.body;
          }
          post.comments.push(commentObj);
          post.save()
            .then((updatedPost) => {
              updatedPost.populate(postsMap, (err, doc) => {
                if (err) {
                  return next(err);
                }
                var comment = _.filter(doc.comments, function (item) {
                  return new Date(item.createdAt).getTime() == new Date(commentObj.createdAt.getTime())
                })[0];
                var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 10, createdBy: req.body.createdBy };
                if (comment) act['comment'] = comment._id;
                createActivityLog(act, function () {
                  return res.json(doc);
                });
              });
            })
            .catch((e) => {
              console.log(e); //eslint-disable-line
              next(e);
            });
        })
      } else {
        commentObj.body = req.body.body;
        post.comments.push(commentObj);
        post.save()
          .then((updatedPost) => {
            updatedPost.populate(postsMap, (err, doc) => {
              if (err) {
                return next(err);
              }
              var comment = _.filter(doc.comments, function (item) {
                return new Date(item.createdAt).getTime() == new Date(commentObj.createdAt.getTime())
              })[0];
              var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 10, createdBy: req.body.createdBy };
              if (comment) act['comment'] = comment._id;
              createActivityLog(act, function () {
                return res.json(doc);
              });
            });
          })
          .catch((e) => {
            console.log(e); //eslint-disable-line
            next(e);
          });
      }
    });
}
/**
 * Update Comment on a Post.
 * @param {string} body -- comment body
 * @param {string} postId -- post to update a comment on
 * @returns {Post} the starred post.
 */
function updateCommentOnPost(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      const comment = post.comments.id(req.params.commentId);
      if (req.body.body) comment.body = req.body.body;
      if (req.body.giphy) comment.giphy = req.body.giphy;
      if (req.body.image) {
        image = new Library(extend(req.body.image, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
        image.save().then((saved) => {
          comment.image = image._id;
          post.save()
            .then((updatedPost) => {
              updatedPost.populate(postsMap, (err, doc) => {
                if (err) {
                  return next(err);
                }
                // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 11, createdBy: comment.createdBy._id };
                // createActivityLog(act, function () {
                return res.json(doc);
                // });
              });
            })
            .catch((e) => {
              console.log(e); //eslint-disable-line
              next(e);
            });
        });
      } else {
        post.save()
          .then((updatedPost) => {
            updatedPost.populate(postsMap, (err, doc) => {
              if (err) {
                return next(err);
              }
              // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 11, createdBy: comment.createdBy._id };
              // createActivityLog(act, function () {
              return res.json(doc);
              // });
            });
          })
          .catch((e) => {
            console.log(e); //eslint-disable-line
            next(e);
          });
      }
    });
}

/**
 * Like Post.
 * @returns {Post} the starred post.
 */
function likeCommentOnPost(req, res, next) {
  const like = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType
  };
  Post.get(req.params.postId)
    .then((post) => {
      const comment = post.comments.id(req.params.commentId);
      if (comment) {
        comment.liked.push(like);
      }
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 13, createdBy: req.body.actedBy };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

/**
 * Remove Like from Comment On Post.
 * DELETE /api/posts/:postId/comments/:commentId/stars/:starId
 * @params {}
 * @returns {Post} the starred post.
 */
function removeLikeFromComment(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      post.comments.id(req.params.commentId).liked.id(req.params.likeId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            return res.json(doc);
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

/**
 * Star Post.
 * @returns {Post} the starred post.
 */
function starCommentOnPost(req, res, next) {
  const star = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType
  };
  Post.get(req.params.postId)
    .then((post) => {
      const comment = post.comments.id(req.params.commentId);
      if (comment) {
        comment.starred.push(star);
      }
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            return res.json(doc);
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Remove Star from Comment On Post.
 * DELETE /api/posts/:postId/comments/:commentId/stars/:starId
 * @params {}
 * @returns {Post} the starred post.
 */
function removeStarFromComment(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      post.comments.id(req.params.commentId).starred.id(req.params.starId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            return res.json(doc);
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Star Post.
 * @returns {Post} the starred post.
 */
function flagCommentOnPost(req, res, next) {
  const flag = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType,
    actionStatus: 'Pending Review'
  };
  Post.get(req.params.postId)
    .then((post) => {
      post.comments.id(req.params.commentId).flagged.push(flag);
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            // var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 15, createdBy: req.body.actedBy };
            // createActivityLog(act, function () {
            return res.json(doc);
            // });
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Remove Flag from Comment On Post.
 * DELETE /api/posts/:postId/comments/:commentId/flags/:flagId
 * @params {}
 * @returns {Post} the starred post.
 */
function removeFlagFromComment(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      post.comments.id(req.params.commentId).flagged.id(req.params.flagId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            return res.json(doc);
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}

/**
 * remove Comment from Post.
 * @returns {Post} the starred post.
 */
function removeCommentFromPost(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      post.comments.id(req.params.commentId).remove();
      post.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            return res.json(doc);
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Add Library Item To Post.
 * @returns {Post} the modified post.
 */
function addLibraryItem(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      const lib = new Library(_.extend(req.body.library, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
      lib.save().then((libItem) => {
        if (!post.cover) {
          post.cover = [];  //eslint-disable-line
        }
        post.cover.push(libItem._id);
        post.save()
          .then((updatedPost) => {
            updatedPost.populate(postsMap, (err, doc) => {
              if (err) {
                return next(err);
              }
              return res.json(doc);
            });
          })
          .catch((e) => {
            console.log(e); //eslint-disable-line
            next(e);
          });
      }).catch((er) => {
        console.log(er);
        next(er);
      });
    });
}
/**
 * Add Library Item To Post.
 * @returns {Post} the modified post.
 */
function addStandAloneLibraryItem(req, res, next) {
  const lib = new Library(_.extend(req.body.library, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
  lib.save()
    .then((libItem) => {
      libItem.populate([{
        path: 'createdBy',
        model: 'User'
      }], (err, doc) => {
        if (err) {
          return next(err);
        }
        return res.json(doc);
      });
    })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}
/**
 * Remove Library Item
 * @returns {Library} the deleted library item.
 */
function removeStandAloneLibraryItem(req, res, next) {
  Library.remove({ _id: req.params.libraryId })
    .then((libItem) => {
      res.json(libItem);
    })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}
/**
 * List Library Items
 * @returns [{Library}] the library items for a user
 */
function listLibraryItems(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Library.listByUserId({ userId: req.params.userId, limit, skip })
    .then(libItems => res.json(libItems))
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}
/**
 * Remove Library Item From Post.
 * @returns {Post} the modified post.
 */
function removeLibraryItem(req, res, next) {
  Post.get(req.params.postId)
    .then((post) => {
      Library.remove({ _id: req.params.libraryId }, (lib) => {
        // console.log(lib);
        const uPost = post;
        if (!uPost.cover) {
          uPost.cover = [];
        } else if (uPost.cover.length === 1) {
          uPost.cover = [];
        } else if (uPost.cover.length > 1) {
          uPost.cover = _.reject(uPost.cover, item => item === req.params.libraryId);
        }
        uPost.save()
          .then((updatedPost) => {
            updatedPost.populate(postsMap, (err, doc) => {
              if (err) {
                return next(err);
              }
              return res.json(doc);
            });
          });
      });
    }).catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

function createActivityLog(actObj, callback) {
  // var act = { _id: mongoose.Types.ObjectId(), post: savedPost._id, type: Activities.types['0'], createdBy: savedPost.createdBy._id };
  const activities = new Activities(actObj);
  createNotification(actObj);
  activities.save().then((savedAct) => {
    callback();
  }).catch((err) => {
    console.info('err', err);
    callback();
  })
}

function createNotification(actObj) {
  Post.get(actObj.post).then(post => {
    if (actObj.createdBy != post.createdBy._id) {
      Notification.getByPostAndType(actObj.activityType, actObj.post)
        .then(notification => {
          if (notification) {
            var recipient = _.filter(notification.recipients, function (item) {
              return item.user._id.toString() == post.createdBy._id.toString();
            })[0];
            if (recipient) {
              recipient.read = false;
              notification.updatedAt = new Date();
              notification.save().then(savedNoti => {
                Notification.get(savedNoti._id)
                  .then(noti => {
                    FCMSender.sendNotification(noti);
                    // console.info('1 savedNoti', savedNoti);
                  }).catch(e => {
                    console.info('1 savedNoti error', e);
                  });
              }).catch(e => {
                console.info('savedNoti error', e);
              });
            }
          } else {
            var notiObje = { _id: mongoose.Types.ObjectId(), post: actObj.post, type: actObj.activityType, recipients: [{ user: post.createdBy._id }], createdBy: actObj.createdBy };
            // if (actObj.comment) notiObje['objectId'] = actObj.comment;
            var notification = new Notification(notiObje);
            notification.save().then(savedNoti => {
              Notification.get(savedNoti._id)
                .then(noti => {
                  FCMSender.sendNotification(noti);
                  // console.info('2 savedNoti', savedNoti);
                }).catch(e => {
                  console.info('2 savedNoti error', e);
                });
            });
          }
        }).catch(e => {
          console.info('getByPostAndType error', e);
        })
    } else {
      console.info('same user for', post._id);
    }
  }).catch(e => {
    console.info('Post.get error', e);
  })
}

function createUniversityNotification(req, res, next) {
  var notiObje = { _id: mongoose.Types.ObjectId(), type: 20 };
  notiObje.body = { title: req.body.title || 'Haller University says', message: req.body.message || 'Hello friends, this is lorem ippsem.' };
  var notification = new Notification(notiObje);
  notification.save().then(savedNoti => {
    Notification.get(savedNoti._id)
      .then(noti => {
        sendUniversityNotification(noti);
        res.json(noti);
        // console.info('university savedNoti', savedNoti);
      }).catch(e => {
        console.info('university savedNoti error', e);
        next(e);
      });
  });
}

function sendUniversityNotification(notification) {
  User.list({ limit: 10, skip: 0 })
    .then(users => {
      FCMSender.sendUniversityNotification(users, notification);
    });
}

//Admin APIS
function adminListByResidence(req, res, next) {
  const { limit = 50, skip = 0, event = false, sortBy = 'createdAt', asc = false } = req.query;
  Post.listByResidenceForAdmin({ residence: req.params.residence, limit, skip, event, sortBy, asc })
    .then(posts => {
      // console.info('posts', posts[0].comments ? posts[0].comments[posts[0].comments.length - 1] : '');
      res.json(posts)
    })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

export default {
  get,
  create,
  update,
  list,
  listByResidence,
  listByUser,
  listByFeed,
  remove,
  removeCover,
  likePost,
  unlikePost,
  starPost,
  unstarPost,
  addCommentToPost,
  updateCommentOnPost,
  starCommentOnPost,
  removeStarFromComment,
  likeCommentOnPost,
  removeLikeFromComment,
  removeCommentFromPost,
  flagPost,
  unFlagPost,
  flagCommentOnPost,
  removeFlagFromComment,
  addLibraryItem,
  removeLibraryItem,
  addStandAloneLibraryItem,
  listLibraryItems,
  removeStandAloneLibraryItem,
  listUserFavorites,
  createUniversityNotification,
  //adminAPIS
  adminListByResidence
};
