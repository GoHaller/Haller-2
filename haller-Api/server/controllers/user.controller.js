import { _, extend } from 'lodash';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import User from '../models/user.model';
import Activities from '../models/activities.model';
import Notification from '../models/notification.model';
import Interest from '../models/interest.model';
import Library from '../models/library.model';
import Post from '../models/post.model';
import Organization from '../models/organizations.model';
import APIError from '../helpers/APIError';
import FCMSender from '../helpers/FCMSender';
import emailVerification from '../cronJobs/emailVerification';

const bcrypt = require('bcryptjs');
const config = require('../../config/env');

/**
 * Get current user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Get user by Id
 * @returns {User}
 */
function getById(req, res, next) {
  User.get(req.params.userId)
    .then(user => res.json(user))
    .error(e => next(e))
    .catch((e) => {
      next(e);
    });
}

/**
 * Get user by Email address
 * @returns {User}
 */
function getByEmail(req, res, next) {
  User.getByEmail(req.params.email || req.body.email)
    .then(user => res.json(user))
    .error(e => next(e))
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

/**
 * Create new user
 * @property {string} req.body.email - The email address of the user.
 * @property {string} req.body.password - The password of the user.
 * @returns { token, User }
 */
function create(req, res, next) {
  getByEmail(req, res, (e) => {
    if (req.body.facebook) {
      User.getByFBId(req.body.facebook.id)
        .then((user) => {
          if (user) {
            // res.json(user);
            const error = new APIError('Facebook account is already in use.', httpStatus.UNAUTHORIZED);
            next(error);
          } else {
            createUser(req, res, next);
          }
        }).catch((e) => {
          createUser(req, res, next);
        });
    } else {
      createUser(req, res, next);
    }
  });
}

function createUser(req, res, next) {
  const user = new User({
    _id: mongoose.Types.ObjectId(), //eslint-disable-line
    email: req.body.email,
    password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : '',
    facebook: req.body.facebook ? req.body.facebook : null,
    status: {
      online: true,
      lastOnline: new Date(),
      currentStatus: 'online',
    }
    // otp: {
    //   token: Math.floor(Math.random() * 900000) + 100000,
    //   active: true
    // }
  });
  user.save()
    .then((savedUser) => {
      const token = jwt.sign({
        email: savedUser.email
      }, config.jwtSecret);
      const userCpy = savedUser;   // update the user status object to
      userCpy.status.activeToken = token;
      userCpy.save().then((upU) => {
        // upU.otp = {};
        res.json({ //eslint-disable-line
          token,
          user: upU,
        })
        // if (userCpy.isRARequested == true && !userCpy.RAData.verificationSent) {
        //   emailVerification.sendIsRAVerificationEmail(upU);
        // }
        // emailVerification.sendVerificationEmail(upU)
        //   .then(({ success, notified }) => {
        //     notified.otp = {};
        //     success ? res.json({ //eslint-disable-line
        //       token,
        //       user: notified,
        //     }) : res.error('not successful notifying user by email')
        //   });
      });
    })
    .catch((exc) => {
      next(exc);
    });
}

function verifyOtp(req, res, next) {
  User.findById(mongoose.Types.ObjectId(req.params.userId))
    .populate(User.populateMap())
    .exec()
    .then((user) => {
      if (user.otp.token == req.params.otp && user.otp.active == true) {
        user.otp.active = false;
        user.save().then(savedUser => res.json(savedUser));
      } else {
        const error = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
        next(error);
      }
    })
    .error(e => next(e))
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

/**
 * Update existing user
 * @property {string} req.body.residence - The residence of user.
 * @property {string} req.body.major - The major of the user.
 * @property {string} req.body.graduationYear - The graduation year of the user.
 * @property {string} req.body.hometown - The hometown of the user.
 * @property {string} req.body.lastName - The last name of the user.
 * @property {string} req.body.mobileNumber - The mobileNumber of the user.
 * @property {string} req.body.bio - The bio of the user.
 * @property {object} req.body.currentProfilePic - The currentProfilePic of the user.
 * @property {object} req.body.currentCoverPic - The currentProfilePic of the user.
 * @property {[string]} req.body.genderPronouns - The genderPronouns of the user.
 * @returns {User}
 */

function update(req, res, next) {
  console.info('req.body.facebook', req.body.facebook);
  if (req.body.facebook) {
    User.getByFBId(req.body.facebook.id)
      .then((user) => {
        if (user) {
          const error = new APIError('Facebook account is already in use.', httpStatus.UNAUTHORIZED);
          next(error);
        } else {
          updateUser(req, res, next);
        }
      }).catch((e) => {
        next(e);
        // updateUser(req, res, next);
      });
  } else {
    updateUser(req, res, next);
  }
}

function updateUser(req, res, next) {
  const body = req.body;
  if (body.currentProfile || body.currentCover) {
    let cover;
    let profile;
    if (body.currentCover) {
      cover = new Library(extend(body.currentCover, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
    }
    if (body.currentProfile) {
      profile = new Library(extend(body.currentProfile, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
    }
    if (cover && profile) {
      Library.insertMany([cover, profile]).then((saved) => { //eslint-disable-line
        User.get(mongoose.Types.ObjectId(req.params.userId)) //eslint-disable-line
          .then((user) => {
            user.currentProfile = profile;  //eslint-disable-line
            user.currentCover = cover;  //eslint-disable-line
            user.save().then(savedUser => res.json(savedUser));
          });
      });
    } else if (cover) {
      cover.save().then((saved) => { //eslint-disable-line
        User.get(mongoose.Types.ObjectId(req.params.userId)) //eslint-disable-line
          .then((user) => {
            user.currentCover = cover; //eslint-disable-line
            user.save().then(savedUser => res.json(savedUser));
          });
      });
    } else {
      profile.save().then((saved) => { //eslint-disable-line
        User.get(mongoose.Types.ObjectId(req.params.userId)) //eslint-disable-line
          .then((user) => {
            user.currentProfile = profile; //eslint-disable-line
            user.save().then(savedUser => res.json(savedUser));
          });
      });
    }
  } else {
    User.update({ _id: req.params.userId }, { $set: req.body }, (err) => { //eslint-disable-line
      if (err) {
        return next(err);
      }
      User.get(mongoose.Types.ObjectId(req.params.userId)) //eslint-disable-line
        .then((user) => {
          if (user.isRARequested && !user.RAData.verificationSent && req.body.isRARequested) {
            emailVerification.sendIsRAVerificationEmail(user);
          }
          res.json(user);
        });
    });
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit: Number.parseInt(limit, 10), skip: Number.parseInt(skip, 10) })
    .then(users => res.json(users))
    .catch((e) => {//eslint-disable-line
      return next(e);
    });
}

function listForUser(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.userWhoBlockedMe(req.params.userId)
    .then(user => {
      User.findOne({ '_id': req.params.userId }, { 'blocked.user': 1 }).exec()
        .then(bu => {
          for (var i = 0; i < bu.blocked.length; i++) {
            user.push({ _id: bu.blocked[i].user });
          }
          User.list({ limit: Number.parseInt(limit, 10), skip: Number.parseInt(skip, 10), blocked: user })
            .then(users => res.json(users))
            .catch((e) => {//eslint-disable-line
              return next(e);
            });
        }).catch((e) => {//eslint-disable-line
          return next(e);
        });
    })
    .catch((e) => {//eslint-disable-line
      return next(e);
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
  User.listByResidence({
    residence: req.params.residence, limit: Number.parseInt(limit, 10),
    skip: Number.parseInt(skip, 10)
  })
    .then(users => res.json(users))
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

function listByResidenceForUser(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.userWhoBlockedMe(req.params.userId)
    .then(user => {
      User.findOne({ '_id': req.params.userId }, { 'blocked.user': 1 }).exec()
        .then(bu => {
          for (var i = 0; i < bu.blocked.length; i++) {
            user.push({ _id: bu.blocked[i].user });
          }
          User.listByResidence({
            residence: req.params.residence, limit: Number.parseInt(limit, 10),
            skip: Number.parseInt(skip, 10), blocked: user
          })
            .then(users => res.json(users))
            .catch((e) => {
              console.log(e); //eslint-disable-line
              next(e);
            });
        }).catch((e) => {//eslint-disable-line
          return next(e);
        });
    })
    .catch((e) => {//eslint-disable-line
      return next(e);
    });
}


/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  User.get(req.params.userId)
    .then((user) => {
      user.remove()
        .then((deletedUser) => {
          res.json(deletedUser);
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          next(e);
        });
    });
}
function verifyUserEmail(req, res, next) {
  const htmlTemplate = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Haller Email Verification</title>
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"><style>body { padding-top:50px; }</style></head><body>
    <div class="container"><div class="jumbotron">
    <h4>Email Verified!</h4><h5>Please make sure to re-enter your account info within the app.</h5></div></div></body></html>`;
  User.get(req.params.userId).then((user) => { //eslint-disable-line
    if (user) {
      user.emailVerified = true; //eslint-disable-line
      user.save()
        .then(() => {
          res.set('Content-Type', 'text/html');
          res.send(htmlTemplate);
        })
        .catch(e => next(e));
    } else {
      const error = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
      return next(error);
    }
  });
}

function verifyUserIsRA(req, res, next) {
  const htmlTemplate = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Haller RA Verification</title>
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"><style>body { padding-top:50px; }</style></head><body>
    <div class="container"><div class="jumbotron">
    <h4>User Verified as RA!</h4></div></div></body></html>`;
  const errorTemplate = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Haller RA Verification</title>
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"><style>body { padding-top:50px; }</style></head><body>
    <div class="container"><div class="jumbotron">
    <h4>User could not be verified as RA at the moment, please try again later!</h4></div></div></body></html>`;
  User.get(req.params.userId).then((user) => { //eslint-disable-line
    if (user && !user.isRA && user.isRARequested && user.RAData.verificationSent) {
      user.isRA = true; //eslint-disable-line
      user.RAData.inviteCode = user.lastName.substr(0, 4) + user.firstName.substr(0, 4) + user.RAData.resFloor;
      var padLen = 9 - user.RAData.inviteCode.length;
      while (padLen > 0) {
        user.RAData.inviteCode = '0' + user.RAData.inviteCode;
        padLen--;
      }
      if (padLen < 0) {
        user.RAData.inviteCode = user.RAData.inviteCode.substr(0 - padLen, 9);
      }
      user.RAData.inviteCode = user.RAData.inviteCode.toUpperCase();
      user.save()
        .then(() => {
          res.set('Content-Type', 'text/html');
          res.send(htmlTemplate);
        })
        .catch(e => next(e));
    } else {
      res.set('Content-Type', 'text/html');
      res.send(errorTemplate);
    }
  });
}

function getAllOrganization(req, res, next) {
  console.info('here', 'getAllOrganization');
  Organization.getAll().then((organizations) => {
    res.json(organizations);
  }).catch((e) => {
    console.info('organizations error', e); //eslint-disable-line
    next(e);
  });
}

function getOrganization(req, res, next) {
  Organization.getByName(req.params.name).then((organizations) => {
    res.json(organizations);
  }).catch((e) => {
    console.info('organizations error', e); //eslint-disable-line
    next(e);
  });
}

function createOrganization(req, res, next) {
  // res.json(req.body);
  const organization = new Organization(extend(req.body, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
  organization.save()
    .then((saved) => {
      res.json(saved);
    })
    .catch(() => {
      const e = new APIError('Error Creating Post!', httpStatus.INTERNAL_SERVER_ERROR);
      next(e);
    });
}

function blockUser(req, res, next) {
  User.get(mongoose.Types.ObjectId(req.params.userId)) //eslint-disable-line
    .then((user) => {
      if (!user.blocked) user.blocked = [];
      var index = -1;
      for (var i = 0; i < user.blocked.length; i++) {
        if (user.blocked[i].user == req.params.blockUserId) {
          index = i;
        }
      }
      if (index > -1) user.blocked.splice(index, 1);
      else user.blocked.push({ user: req.params.blockUserId, at: new Date() });
      user.save().then((userSaved) => { userSaved.otp = {}; res.json(userSaved) });
    })
    .catch(() => {
      const e = new APIError('Error Creating Post!', httpStatus.INTERNAL_SERVER_ERROR);
      next(e);
    });
}

function getBlockedUsers(req, res, next) {
  User.getBlockedUsers(req.params.userId)
    .then((blockedUsers) => {
      blockedUsers.forEach(function (buser) {
        buser.otp = {};
        buser.blocked = [];
        buser.password = '';
      });
      res.json(blockedUsers);
    })
    .catch(() => {
      const e = new APIError('Error Creating Post!', httpStatus.INTERNAL_SERVER_ERROR);
      next(e);
    });
}

//INterest Master List
function getInterestList(req, res, next) {
  Interest.getByName(req.params.key)
    .then(list => {
      res.json(list);
    }).catch((e) => {
      console.info('organizations error', e); //eslint-disable-line
      next(e);
    });
}

function addInterest(req, res, next) {
  if (req.params.key) {
    const interest = new Interest(extend({ name: req.params.key }, { _id: mongoose.Types.ObjectId() })); //eslint-disable-line
    interest.save()
      .then((saved) => {
        res.json(saved);
      })
      .catch(() => {
        const e = new APIError('Error Creating Post!', httpStatus.INTERNAL_SERVER_ERROR);
        next(e);
      });
  } else {
    const e = new APIError('Error Creating Post!', httpStatus.BAD_REQUEST);
    next(e);
  }
}

function getActivities(req, res, next) {
  Activities.get(req.params.userId)
    .then(activities => {
      var acts = [];
      if (activities) {
        acts = JSON.parse(JSON.stringify(activities));
        for (var a = 0; a < acts.length; a++) {
          acts[a].title = Activities.types[acts[a].activityType.toString()];
        }
      }
      res.json(acts);
    })
    .error(e => next(e))
    .catch((e) => {
      next(e);
    });
}

function getNotification(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Notification.list({ userId: req.params.userId, skip, limit })
    .then(noties => {
      var finalNoties = [];
      noties.forEach(item => {
        if ([10, 4, 17].indexOf(item.type) > -1) {
          var notiesObj = {};
          notiesObj._id = item._id;
          notiesObj.type = item.type;
          notiesObj.post = { details: item.post.details, _id: item.post._id };
          if (item.type == 10) {
            var data = getNamesFromArray(item.post.comments);
            notiesObj.title = data + ' ' + 'commented on your ' + (item.post.isEvent ? 'event' : 'post');
            notiesObj.lastObj = item.post.comments[item.post.comments.length - 1];
          } else if (item.type == 17) {
            var data = getNamesFromArray(item.post.going);
            notiesObj.title = data + ' ' + 'joined your event.';
            notiesObj.lastObj = item.post.going[item.post.going.length - 1];
          } else if (item.type == 4) {
            var data = getNamesFromArray(item.post.liked);
            notiesObj.title = data + ' ' + 'liked your ' + (item.post.isEvent ? 'event' : 'post');
            notiesObj.lastObj = item.post.liked[item.post.liked.length - 1];
          }
          var recipient = _.filter(item.recipients, function (item) {
            return item.user._id == req.params.userId
          })
          notiesObj.read = recipient[0].read;
          notiesObj.createdAt = item.createdAt;
          finalNoties.push(notiesObj);
        }
      })
      res.json(finalNoties);
    })
    .catch((e) => {
      console.log(e); //eslint-disable-line
      next(e);
    });
}

function readNotification(req, res, next) {
  Notification.get(req.params.notificationId)
    .then(notification => {
      notification.recipients.forEach(item => {
        if (item.user._id == req.params.userId) {
          item.read = true;
        }
      });
      notification.save().then(savedNotification => {
        var notiesObj = {};
        if ([10, 4, 17].indexOf(savedNotification.type) > -1) {
          notiesObj._id = savedNotification._id;
          notiesObj.type = savedNotification.type;
          notiesObj.post = { details: savedNotification.post.details, _id: savedNotification.post._id };
          if (savedNotification.type == 10) {
            var data = getNamesFromArray(savedNotification.post.comments);
            notiesObj.title = data + ' ' + 'commented on your ' + (savedNotification.post.isEvent ? 'event' : 'post');
            notiesObj.lastObj = savedNotification.post.comments[savedNotification.post.comments.length - 1];
          } else if (savedNotification.type == 17) {
            var data = getNamesFromArray(savedNotification.post.going);
            notiesObj.title = data + ' ' + 'joined your event.';
            notiesObj.lastObj = savedNotification.post.going[item.post.going.length - 1];
          } else if (savedNotification.type == 4) {
            var data = getNamesFromArray(savedNotification.post.liked);
            notiesObj.title = data + ' ' + 'liked your event.';
            notiesObj.lastObj = savedNotification.post.liked[savedNotification.post.liked.length - 1];
          }
          var recipient = _.filter(savedNotification.recipients, function (savedNotification) {
            return savedNotification.user._id == req.params.userId
          })
          notiesObj.read = recipient[0].read;
          notiesObj.createdAt = savedNotification.createdAt;
        }
        res.json(notiesObj);
      })
    })
}

function getNamesFromArray(nameList) {
  var names = [];
  var allNames = [];
  for (var n = (nameList.length - 1); n >= 0; n--) {
    var fullName = nameList[n].createdBy ? (nameList[n].createdBy.firstName + ' ' + nameList[n].createdBy.lastName) : (nameList[n].actedBy.firstName + ' ' + nameList[n].actedBy.lastName);
    if (allNames.indexOf(fullName) == -1) {
      allNames.push(fullName);
      if (names.length < 3) names.push(fullName);
    }
  }
  return names.join(', ') + (allNames.length > 3 ? (allNames.length - 3) : '');
}

function sendNotification(req, res, next) {
  // console.log('=========================================================');
  var toId = 'f-WoY-10gpU:APA91bGV6JVX0UnQSmkZqGIFlK_WnN4YMyuVuhnWrnn4-br7WdX1HeXvCg1f8msuULZMoXCATV06X6RAUo789h-qBWl4MRnJ2FkwsOcESbR-TWLivzHHi8vu2aYzDZ3Sswo9cRphGOU0'; // required fill with device token or topics
  var token = [toId];
  var message = {
    title: 'Haller',
    notId: req.params.msg,
    your_custom_data_key: 'your_custom_data_value',
    message: 'Body of your push notification' + req.params.msg,
  }
  // console.info('message', message);
  // console.log('----------------------------------------------------------');
  FCMSender.send(token, message)
    .then(function (response) {
      // console.log("Successfully sent with response: ", response);
      // console.log('=========================================================');
      res.json(response);
    })
    .catch(function (err) {
      console.log("Something has gone wrong!");
      console.error(err);
      // console.log('=========================================================');
      res.json(err);
    })
}

//admin users list
function allUsersByFilter(req, res, next) {
  var search = req.body.search.value || '';
  var limit = req.body.length || 25;
  var skip = req.body.start || 0;
  User.find({
    $and: [{
      $or: [
        { firstName: { $regex: '^' + search, $options: 'i' } },
        { lastName: { $regex: '^' + search, $options: 'i' } },
        { residence: { $regex: '^' + search, $options: 'i' } },
        { role: { $regex: '^' + search, $options: 'i' } }]
    }, { _id: { $ne: req.params.userId } }]
  }).count().exec().then(function (userCount) {
    User.find({
      $and: [{
        $or: [
          { firstName: { $regex: '^' + search, $options: 'i' } },
          { lastName: { $regex: '^' + search, $options: 'i' } },
          { residence: { $regex: '^' + search, $options: 'i' } },
          { role: { $regex: '^' + search, $options: 'i' } }]
      }, { _id: { $ne: req.params.userId } }]
    }).select({ "currentProfile": 1,"firstName": 1,"_id":1, "isRA":1,"lastName": 1,"graduationYear":1, "residence": 1, "role": 1, "isBlocked": 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
      .then((Users) => {
        if (Users) {
          Post.getAll()
            .then(post => {
             
            //  var userData={};
              var userInfo = [];
              for(var i=0;i<Users.length;i++){
                var userData={};
                //post count
                  var postCount    = 0;
                  var eventCount   = 0;
                  var commentCount = 0;
                  var commentAvg   = 0;
                  var coverCount   = 0;
                  for(var j=0; j<post.length;j++){
                    var uId  = (Users[i]._id).toString();
                    var pUId = (post[j].createdBy._id).toString();
                    if(uId == pUId){
                      postCount += 1;
                      //event count
                      if( post[j].isEvent){
                        eventCount += 1; 
                      }
                      //comment avg
                      if(post[j].comments.length > 0){
                        commentCount += post[j].comments.length; 
                      }
                      //image count
                      if((post[j].cover).length>0 && post[j].cover != "undefined" ){
                        coverCount += post[j].cover.length;
                      }
                    }
                  }
                  commentAvg = Math.round(commentCount / postCount);
                  userData._id = Users[i]._id;
                  userData.currentProfile = Users[i].currentProfile;
                  userData.firstName = Users[i].firstName;
                  userData.isRA = Users[i].isRA;
                  userData.lastName = Users[i].lastName;
                  userData.graduationYear = Users[i].graduationYear;
                  userData.residence = Users[i].residence;
                  userData.role = Users[i].role;
                  userData.isBlocked = Users[i].isBlocked;
                  userData.postcount  = postCount;
                  userData.eventcount = eventCount;
                  userData.commentavg = commentAvg;
                  userData.covercount  = coverCount;
                  //push data
                  userInfo[i]=userData
              }
              return res.json({
                "draw": 1,
                "recordsTotal": Users.length,
                "recordsFiltered": userCount,
                "data": userInfo
              });
            });
        } else {
          const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        }
      }).catch((e) => {//eslint-disable-line
        return next(e);
      });
  });
}

function toggleUserStatus(req, res, next) {
  User.update({ _id: req.body.userId }, { $set: { isBlocked: req.body.sataus } }).exec().then((status) => {
    if (status) {
      res.json(status);
    } else {
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }
  }).catch((e) => {//eslint-disable-line
    return next(e);
  });;
}

function getBotUser(req, res, next) {
  if (req.params.email) {
    var email = 'dev.bot@' + req.params.email.split('@')[1];
    User.findOne({ email: email, role: 'bot' })
      .then(user => res.json(user))
      .error(e => next(e))
      .catch((e) => {
        console.log(e); //eslint-disable-line
        next(e);
      });
  }
}

export default {
  get,
  getById,
  getByEmail,
  create,
  verifyOtp,
  update,
  list,
  listForUser,
  listByResidence,
  listByResidenceForUser,
  remove,
  verifyUserEmail,
  verifyUserIsRA,
  getOrganization,
  createOrganization,
  blockUser,
  getBlockedUsers,
  getInterestList,
  addInterest,
  getActivities,
  getNotification,
  readNotification,
  sendNotification,
  getAllOrganization,
  allUsersByFilter,
  toggleUserStatus,
  getBotUser
};
