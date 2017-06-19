import _ from 'lodash';
import Post from '../models/post.model';
import config from '../../config/env';

const mailgun = require('mailgun-js')({
  apiKey: config.mailgun.key,
  domain: config.mailgun.domain
});


const sendFlaggedEmailWithMailgun = post =>
  new Promise((fulfill, reject) => { //eslint-disable-line
    if (config.env === 'test') {
      return fulfill(post);
    }
    const flaggingUsersNameArray = [];
    const flaggingUsersIdsArray = [];
    const newFlags = [];
    _.each(post.flagged, (flag) => {
      if (flag.status === 'Pending Review') {
        flaggingUsersNameArray.push(`${flag.actedBy.firstName} ${flag.actedBy.lastName}`);
        flaggingUsersIdsArray.push(flag.actedBy._id);
        newFlags.push(flag._id);
      }
    });
    const flaggingUsersNames = flaggingUsersNameArray.join(', ');
    const flaggingUsersIds = flaggingUsersIdsArray.join(', ');
    const posterFullName = `${post.createdBy.firstName} ${post.createdBy.lastName}`;

    const data = {
      from: 'Haller Alerts <noreply@gohaller.com>',
      to: 'support@gohaller.com',
      subject: `Flagged Haller ${(post.isEvent ? 'Event' : 'Post')}`,
      html: `<h2 style="text-align:center">Flagged Haller ${(post.isEvent ? 'Event' : 'Post')}
      </h2><p>The following ${(post.isEvent ? 'event' : 'post')} has been flagged on Haller:<br />
      ${(post.isEvent ? `<strong>${post.title}</strong><br />` : '')}
      ${post._id} <br />Created by user ${posterFullName} </p>
      <p>${(post.isEvent ? 'Event' : 'Post')} details:<br />${post.details}</p>
      <p>This was reported by user <strong>${flaggingUsersNames}</strong><br />${flaggingUsersIds}</p>
      <hr /><p style="font-size:small; color:#777;">This is an automated message sent via Mailgun on
        ${(new Date().toString())} in the user's local timezone.<br />
      This will be the only report for this flagging incident.</p>`
    };

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.error(error); //eslint-disable-line
      } else {
        console.log(body); //eslint-disable-line
        _.each(newFlags, (flagId) => {
          const flag = post.flagged.id(flagId);
          flag.actionStatus = 'In Review';
          post.save().then(p => fulfill(p)).catch(e => reject(e));//eslint-disable-line
        });
      }
    });
  });

const sendFlaggedPostEmails = () => {
  Post.getPendingFlaggedPosts().then((posts) => {
    if (posts && posts.length > 0) {
      _.each(posts, (post) => {
        sendFlaggedEmailWithMailgun(post);
      });
    }
  });
};

export default { sendFlaggedEmailWithMailgun, sendFlaggedPostEmails };
