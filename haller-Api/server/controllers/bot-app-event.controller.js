import _ from 'lodash';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import BotEvent from '../models/bot-events.model';
import Activities from '../models/activities.model';
import Notification from '../models/notification.model';
import FCMSender from '../helpers/FCMSender';
import Library from '../models/library.model';
import APIError from '../helpers/APIError';
import { postsMap } from '../helpers/BotUserPopulateMaps';
import BotUser from '../models/bot-users.model';

/**
 * Get Event
 * @param {string} eventId - _id of the event to be fetched
 * @returns {Post}
 */
function get(req, res, next) {
  if (req.params && req.params.eventId) {
    BotEvent.get(req.params.eventId)
      .then(event => res.json(event))
      .error(e => next(e))
      .catch(e => next(e));
  }
}

/**
 * Get User Events
 * @param {string} userId - _id of the event to be fetched
 * @returns {Post}
 */
function userEvents(req, res, next) {
  if (req.params && req.params.userId) {
    BotEvent.listUserEvents({
      userId: req.params.userId,
      skip: req.query.skip || 0,
      limit: req.query.limit || 100
    })
      .then(post => res.json(post))
      .error(e => next(e))
      .catch(e => next(e));
  }
}
/**
 * Get Event
 * @param {string} eventId - _id of the event to be removed
 * @returns {Post}
 */
function remove(req, res, next) {
  if (req.params && req.params.eventId) {
    BotEvent.get(req.params.eventId)
      .then((event) => {
        event.remove().then(deletedEvent => res.json(deletedEvent)).catch(e => next(e));
      })
      .error(e => next(e))
      .catch(e => next(e));
  }
}

/**
 * Create new event
 * @property {string} req.body.title - The title for the event
 * @property {string} req.body.details - The details of the event
 * @property {Date} req.body.date - The date of the event
 * @property {Date} req.body.time - The time of the event
 * @property {String} req.body.cover - The url to the image for the event
 * @property {String} req.body.location - The url to the image for the event
 * @property {String} req.body.authorResidence - The residence of the author of this event
 * @property {String} req.body.createdBy - The user id of the creator of this event
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
      const event = new BotEvent(_.extend(postBody, { _id: mongoose.Types.ObjectId(), isEvent: true })); //eslint-disable-line
      event.save()
        .then((savedEvent) => {
          savedEvent.populate(postsMap, (er, doc) => {
            if (er) {
              return next(er);
            }
            var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 1, createdBy: req.body.createdBy };
            createActivityLog(act, function () {
              return res.json(doc);
            });
          });
        })
        // .catch(() => {
        //   const e = new APIError('Error Creating Event!', httpStatus.INTERNAL_SERVER_ERROR);
        //   next(e);
        // });
    }).catch((err) => {
      console.error(err);
      return next(err);
    });
  } else {
    const event = new BotEvent(_.extend(postBody, { _id: mongoose.Types.ObjectId(), isEvent: true })); //eslint-disable-line
    event.save()
      .then((savedEvent) => {
        savedEvent.populate(postsMap, (err, doc) => {
          if (err) {
            return next(err);
          }
          var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 1, createdBy: req.body.createdBy };
          createActivityLog(act, function () {
            return res.json(doc);
          });
        });
      })
    //   .catch(() => {
    //     const err = new APIError('Error Creating Event!', httpStatus.INTERNAL_SERVER_ERROR);
    //     next(err);
    //   });
  }
}

/**
 * Update existing event
 * @property {string} title - The title of the event
 * @property {string} details - The event body.
 * @property {string} cover - The photo attached to the event.
 * @property {date} date - The date for the event.
 * @property {string} time - The time of the event
 * @returns {Post}
 */
function update(req, res, next) {
  BotEvent.get(req.params.eventId)
    .then((event) => {
      const body = req.body;
      const updatedPost = event;
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
                return res.json(doc);
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
              return res.json(doc);
            });
          })
          .catch((e) => {
            next(e);
          });
      }
    });
}
/**
 * Going to Event.
 * @returns {Post} the starred post.
 */
function goingEvent(req, res, next) {
  const going = {
    actedAt: new Date(),
    actedBy: req.body.actedBy,
    actionType: req.body.actionType
  };
  BotEvent.get(req.params.eventId)
    .then((event) => {
      event.going.push(going);
      event.save()
        .then((updatedPost) => {
          updatedPost.populate(postsMap, (err, doc) => {
            if (err) {
              return next(err);
            }
            var act = { _id: mongoose.Types.ObjectId(), post: doc._id, activityType: 17, createdBy: req.body.actedBy };
            createActivityLog(act, function () {
              return res.json(doc);
            });
            // return res.json(doc);
          });
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
/**
 * Not Going To Event.
 * @returns {Event} the event to have the going flag removed from
 */
function deleteGoingEvent(req, res, next) {
  BotEvent.get(req.params.eventId)
    .then((event) => {
      event.going.id(req.params.goingId).remove();
      event.save()
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
  BotEvent.get(actObj.post).then(post => {
    if (actObj.createdBy != post.createdBy._id) {
      Notification.getByPostAndType(actObj.activityType, actObj.post)
        .then(notification => {
          if (notification) {
            var recipient = _.filter(notification.recipients, function (item) {
              return item.user.toString() == post.createdBy._id.toString();
            })[0];
            if (recipient) {
              recipient.read = false;
              notification.updatedAt = new Date();
              notification.save().then(savedNoti => {
                // console.info('savedNoti', savedNoti);
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
            var notification = new Notification(notiObje);
            notification.save().then(savedNoti => {
              // console.info('1 savedNoti', savedNoti);
              Notification.get(savedNoti._id)
                .then(noti => {
                  FCMSender.sendNotification(noti);
                  // console.info('1 savedNoti', savedNoti);
                }).catch(e => {
                  console.info('1 savedNoti error', e);
                });
            }).catch(e => {
              console.info('1 savedNoti error', e);
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

/**
 * Get user list by feed.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Post[]}
 */
function listByFeed(req, res, next) {
  const { limit = 50, skip = 0, event = null } = req.query;
  BotUser.userWhoBlockedMe(req.params.userId).then(blockedMe => {
    BotUser.get(mongoose.Types.ObjectId(req.params.userId)).then((user) => { //eslint-disable-line
      var q = {
        feed: req.params.feed,
        residenceHall: user.residence,
        limit: Number.parseInt(limit, 10),
        skip: Number.parseInt(skip, 10),
        isEvent: event,
        blockedMe: blockedMe,
        deleted: false,
        isHidden: false,
        'flagged.3': { $exists: false }
      }
      BotEvent.listByFeed(q)
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

export default { get, create, remove, update, goingEvent, deleteGoingEvent, userEvents, listByFeed };
