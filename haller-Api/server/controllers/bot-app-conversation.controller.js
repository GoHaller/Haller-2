import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../helpers/APIError';
import BotConversation from '../models/bot-conversation.model';
import devBot from '../controllers/bot.controller';

var botConvoCtrl = {
  getByCreater: (req, res, next) => {
    BotConversation.findOne({ createdBy: req.params.userId }).exec((error, result) => { res.json(result); });
  },
  asktoBot: (req, res, next) => {
    // req.body = { message: '', createdBy: '', conversationId: '', participant: '', accessToken: '' }//participant is bot id
    var message = { body: req.body.message, createdBy: req.body.createdBy, createdAt: new Date() }

    if (req.body.conversationId) {
      BotConversation.get(req.body.conversationId)
        .then(convo => {
          const copyConvo = convo;
          copyConvo.messages.push(message);
          devBot.sendText(req.body.accessToken, req.body.conversationId, req.body.message, (error, response) => {

            if (error) { response = 'Sorry! Bot need a doctor right now.' }
            var botMessage = { botBody: response, createdBy: req.body.participant, createdAt: new Date() }
            copyConvo.messages.push(botMessage);

            copyConvo.save().then((doc) => {
              if (doc) { return res.json(doc); }
              else { const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND); return next(error); }
            });
          });
        }, error => {
          console.log('asktoBot error', error);
          const err = new APIError('Try latter', httpStatus.INTERNAL_SERVER_ERROR);
          return next(err);
        })
    } else {
      var convoObj = {
        _id: mongoose.Types.ObjectId(), participants: [req.body.createdBy, req.body.participant],
        messages: [message], createdAt: new Date(), createdBy: req.body.createdBy, type: 'bot'
      }

      devBot.sendText(req.body.accessToken, convoObj._id.toString(), req.body.message, (error, response) => {

        if (error) { response = 'Sorry! Bot need a doctor right now.' };
        var botMessage = { botBody: response, createdBy: req.body.participant, createdAt: new Date() }
        convoObj.messages.push(botMessage);
        const convo = new BotConversation(convoObj);

        convo.save().then((doc) => {
          if (doc) { return res.json(doc); }
          else { const error = new APIError('No such conversation exists!', httpStatus.NOT_FOUND); return next(error); }
        });
      });
    }
  }
}

export default botConvoCtrl;
