var FCM = require('fcm-push');

// var serverKey = 'AAAAL1rOLL4:APA91bFz-xlHqG64o8fw6UKJzvEUWMyF77Ut6jwnZpu3nMDvGJEezmc1_jzoJ35_iXyBLVdAAs4fBXKAnb65D6tZIUYZ54K1nl5RmMguicYf6IQZ_dCu5CN2ZhCd8eNDgS2cBEtKQnCa';
// var serverKey = 'AIzaSyCAXcB-CMYvpndUZJpi4_yTECtwq-mc3wo';
var serverKey = 'AAAANRrpQRE:APA91bGjf75IcnOQIueh6KKXRecfRVfTTZPKqU4Na2AyEKaWzwx92vlFpo3WmYyCZGN-L-iNR93JlQy5yEsS_5dPDpV_F7Ry05FXfNKqE78zAh5vIGyE9CJ8rdIkeWWVPIYmjFd5qpxm';
// var serverKey = 'AIzaSyDaT3C_HnOb-kPjfGAhO0RrCitx6KMjDG4';
var fcm = new FCM(serverKey);

// var paylods = {
//     to: 'f-WoY-10gpU:APA91bGV6JVX0UnQSmkZqGIFlK_WnN4YMyuVuhnWrnn4-br7WdX1HeXvCg1f8msuULZMoXCATV06X6RAUo789h-qBWl4MRnJ2FkwsOcESbR-TWLivzHHi8vu2aYzDZ3Sswo9cRphGOU0', // required fill with device token or topics
//     data: {
//         your_custom_data_key: 'your_custom_data_value'
//     },
//     notification: {
//         title: 'Title of your push notification',
//         body: 'Body of your push notification',
//         sound: 'default',
//         icon: 'icon'
//     }
// };

const send = (token, message, os) => {
  message.message = message.body;
  var paylods = {
    registration_ids: token,
    notId: message.notId,
    data: message
  };
  if (os == 'ios') {
    paylods.notification = {
      title: message.title,
      body: message.body,
      sound: 'default'
    };
    paylods.content_available = true;
    paylods.priority = 'high';
  }
  console.log('paylods', paylods);
  return fcm.send(paylods);
}

const getNamesFromArray = (nameList, userId) => {
  var names = [];
  var allNames = [];
  for (var n = (nameList.length - 1); n >= 0; n--) {
    var createdBy = nameList[n].createdBy ? nameList[n].createdBy : nameList[n].actedBy
    if (userId.toString() != createdBy._id.toString()) {
      var fullName = createdBy.firstName + ' ' + createdBy.lastName;
      if (allNames.indexOf(fullName) == -1) {
        allNames.push(fullName);
        if (names.length < 3) names.push(fullName);
      }
    }
  }
  return names.join(', ') + (allNames.length > 3 ? (allNames.length - 3) : '');
}

const sendNotification = (item) => {
  item.recipients.forEach((recipient) => {
    var token = [];
    var os = 'ios';
    if (recipient.user.notifications && recipient.user.notifications.deviceToken && recipient.user.notifications.enabled) {
      token.push(recipient.user.notifications.deviceToken);
      os = recipient.user.notifications.os;
    }

    if (token.length > 0) {
      var notiesObj = {};
      notiesObj.title = 'Haller';
      notiesObj._id = item._id;//notification table id
      notiesObj.type = item.type;
      notiesObj.notId = item.post._id.toString().substr(-4) + item.type;
      notiesObj.post = { details: item.post.details, _id: item.post._id };
      notiesObj.createdAt = item.updatedAt;
      if (item.type == 10) {
        var data = getNamesFromArray(item.post.comments, recipient.user._id);
        notiesObj.body = data + ' ' + 'commented on your ' + (item.post.isEvent ? 'event' : 'post');
      } else if (item.type == 17) {
        var data = getNamesFromArray(item.post.going, recipient.user._id);
        notiesObj.body = data + ' ' + 'joined your event.';
      } else if (item.type == 4) {
        var data = getNamesFromArray(item.post.liked, recipient.user._id);
        notiesObj.body = data + ' ' + 'liked your ' + (item.post.isEvent ? 'event' : 'post');
      }
      console.info('notiesObj', notiesObj.notId);
      send(token, notiesObj, os)
        .then(function (response) {
          console.log("Successfully sent with response");//, JSON.stringify(response));
          console.log('=========================================================');
        })
        .catch(function (err) {
          console.log("Something has gone wrong!");
          console.error(err);
          console.log('=========================================================');
        })
    }
  });
}

const sendMsgNotification = (message, convo) => {
  var createdBy;
  convo.participants.forEach((participant) => {
    if (participant._id.toString() == message.createdBy.toString())
      createdBy = participant;
  });
  // console.info('createdBy', createdBy);
  if (createdBy) {
    convo.participants.forEach((participant) => {
      var token = [];
      var os = 'ios';
      if (participant.notifications.deviceToken) {
        let userTurnedOff = convo.notificationOffFor.filter(item => {
          return (item.user.toString() == participant._id.toString());
        });
        if (userTurnedOff.length == 0 && createdBy._id.toString() != participant._id.toString()) {
          token.push(participant.notifications.deviceToken);
          os = participant.notifications.os;
        }
      }

      if (token.length > 0) {
        var notiesObj = {};
        notiesObj.title = 'Haller';
        notiesObj._id = convo._id;
        notiesObj.convo = { _id: convo._id };
        notiesObj.type = 19;
        notiesObj.notId = convo._id.toString().substr(-4) + notiesObj.type;
        notiesObj.createdAt = message.createdAt;
        notiesObj.body = createdBy.firstName + ' ' + createdBy.lastName;
        if (convo.participants.length > 2)
          notiesObj.body += ' has posted in ' + (convo.groupName || '') + ' group chat';
        else
          notiesObj.body += ' has sent you a message';
        console.info('msg notiesObj', notiesObj.notId);
        send(token, notiesObj, os)
          .then(function (response) {
            console.log("Successfully sent with response");//, JSON.stringify(response));
            console.log('=========================================================');
          })
          .catch(function (err) {
            console.log("Something has gone wrong!");
            console.error(err);
            console.log('=========================================================');
          })
      }
    });
  }
}

const sendUniversityNotification = (participants, message) => {
  participants.forEach((participant) => {
    var token = [];
    var os = 'ios';
    if (participant.notifications.deviceToken) {
      token.push(participant.notifications.deviceToken);
      os = participant.notifications.os;
    }
    if (token.length > 0) {
      var notiesObj = {};
      notiesObj.title = message.body.title;
      notiesObj.message = message.body.message;
      notiesObj.body = message.body.message;
      notiesObj.uni_msg = message.body;
      notiesObj._id = message._id;
      notiesObj.type = 20;
      notiesObj.notId = message._id.toString().substr(-4) + notiesObj.type;
      console.info('msg notiesObj', notiesObj.notId);
      send(token, notiesObj, os)
        .then(function (response) {
          console.log('=======================success===========================');
          console.log("Successfully sent with response");//, JSON.stringify(response));
          console.log('=========================================================');
        })
        .catch(function (err) {
          console.log('========================error============================');
          console.log("Something has gone wrong!");
          console.info('err', err);
          console.log('=========================================================');
        })
    }
  });
}

export default { send, sendNotification, sendMsgNotification, sendUniversityNotification };
