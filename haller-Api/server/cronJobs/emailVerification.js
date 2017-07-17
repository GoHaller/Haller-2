import config from '../../config/env';

const mailgun = require('mailgun-js')({
  apiKey: config.mailgun.key,
  domain: config.mailgun.domain
});

const makeToken = () => { //eslint-disable-line
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) { //eslint-disable-line
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const sendVerificationEmail = user =>
  new Promise((fulfill, reject) => { //eslint-disable-line
    if (config.env === 'test') {
      return fulfill({ success: true, notified: user });
    }
    const link = `${config.rootUrl}users/${user._id}/verify-email`;
    const data = {
      from: 'Haller Verification <noreply@gohaller.com>',
      to: user.email,
      subject: 'Verify your Haller email address',
      //html: `<h2 style="text-align:center">Your OTP is ` + user.otp.token + `, Click <a href="${link}" rel="nofollow noreferrer" target="_blank">on this link</a> to verify your email address and begin using Haller.</h2><br />`
      html: `<h2 style="text-align:center">Click <a href="${link}" rel="nofollow noreferrer" target="_blank">on this link</a> to verify your email address and begin using Haller.</h2><br />`
    };
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.error(error); //eslint-disable-line
        reject(error);
      } else {
        console.log(body); //eslint-disable-line
        user.verificationSent = new Date(); //eslint-disable-line
        user.save().then((u) => fulfill({ success: true, notified: u })); //eslint-disable-line
      }
    });
  });

const sendIsRAVerificationEmail = user =>
  new Promise((fulfill, reject) => { //eslint-disable-line
    if (config.env === 'test') {
      return fulfill({ success: true, notified: user });
    }
    const link = `${config.rootUrl}users/${user._id}/verify-ra`;
    const data = {
      from: 'Haller Verification <noreply@gohaller.com>',
      to: 'support@gohaller.com, waghelanikit@gmail.com',
      subject: 'RA Verification requested by ' + user.firstName,
      html: `<h2 style="text-align:center">Click <a href="${link}" rel="nofollow noreferrer" target="_blank">on this link</a></h2> to verify user: <b> ' + user.firstName + ' ' + user.lastName + '</b> residence: <b>' + user.residence + '</b> email: <b>' + user.email + '</b> is a Haller RA.<br />`
    };
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.error(error); //eslint-disable-line
        reject(error);
      } else {
        console.log(body); //eslint-disable-line
        user.RAData.verificationSent = new Date(); //eslint-disable-line
        user.save().then((u) => fulfill({ success: true, notified: u })); //eslint-disable-line
      }
    });
  });

const sendProblemReportEmail = (user, problemData) =>
  new Promise((fulfill, reject) => { //eslint-disable-line
    if (config.env === 'test') {
      return fulfill({ success: true, notified: user });
    }
    const link = `${config.rootUrl}users/${user._id}/verify-email`;
    const data = {
      from: 'Haller Problem <noreply@gohaller.com>',
      to: 'kamal.mandalia@plutustec.com',
      subject: 'By ' + user.firstName + ' ' + user.lastName,
      html: `<h3> Residence: ` + user.residence + `<h3/>` +
      `<h3>Issue Title: ` + problemData.title + `</h3>` +
      `<h3>Issue Description: ` + problemData.description + `</h3>`
    };
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.error(error); //eslint-disable-line
        reject(error);
      } else {
        // console.log(body); //eslint-disable-line
        fulfill({ success: true, notified: user }); //eslint-disable-line
      }
    });
  });

export default { sendVerificationEmail, sendIsRAVerificationEmail, sendProblemReportEmail };
