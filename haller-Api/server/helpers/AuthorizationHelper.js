import httpStatus from 'http-status';
import User from '../models/user.model';
import config from '../../config/env';
import APIError from './APIError';

/**
 * Load user and append to req.
 */
const load = (res, req, id, next) => {
  if (req.params.userId) {
    User.get(req.params.userId)
      .then((user) => {
        req.user = user; // eslint-disable-line no-param-reassign
        next();
      })
      .catch((e) => {
        next(e);
      });
  }
};

const getToken = (req) => {
  if (req.headers && req.headers.authorization) {
    return req.headers.authorization.split(':')[1];
  }
  return null;
};

const checkInviteCode = (req, res, next) => {
  if (req.body.code && req.body.code === config.inviteCode) {
    return res.json({ success: true });
  }

  User.getByCode(req.body.code).then((referer) => {
    if (req.body.code && referer.isRA && req.body.code === referer.RAData.inviteCode) {
      referer.RAData.codeUsageCount++;
      referer.save();
      return res.json({ success: true });
    }
  })
    .catch(e => next(new APIError('Bad Request -- invalid code', httpStatus.BAD_REQUEST)));
};

const inviteCodeStats = (req, res, next) => {
  User.listRAs().then((referers) => {
    var html = "<h3> No RAs registered yet!</h3>";
    if (referers.length !== 0)
      html = "<table border=1><tr><th>Name</th><th>isRA</th><th>code</th><th>residence</th><th>codeUsageCount</th></tr>";

    referers.forEach(referer => {
      html += "<tr><td>" + referer.firstName + " " + referer.lastName + " </td>"
      html += "<td>" + referer.isRA + "</td>"
      html += "<td>" + referer.RAData.inviteCode + "</td>"
      html += "<td>" + referer.residence + "</td>"
      html += "<td>" + referer.RAData.codeUsageCount + "</td></tr>"
    });
    if (referers.length !== 0)
      html += "</table>";

    res.set('Content-Type', 'text/html');
    res.send(html);
    return;
  })
    .catch(e => next(new APIError('Bad Request -- invalid code', httpStatus.BAD_REQUEST)));
};

const getUsersWhoBlockedMe = (req, res, next) => {
  if (req.params.userId) {
    User.usersWhoBlockedMe(req.params.userId)
      .then((user) => {
        req.usersWhoBlockedMe = user; // eslint-disable-line no-param-reassign
        next();
      })
      .catch((e) => {
        next(e);
      });
  }
}

export default { load, getToken, checkInviteCode, inviteCodeStats };
