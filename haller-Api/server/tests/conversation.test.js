import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import User from '../models/user.model';


chai.config.includeStack = true;
let conversation = {};
let message = {};
let message2 = {};
let sender = {};
let recipient = {};

describe('## Conversation APIs', () => {
  after((done) => {
    User.remove({ _id: recipient._id }).then(() => done());
  });
  before((done) => {
    const unhashedPasswordUser = {
      email: 'abcdef@gmail.com',
      password: 'testing'
    };
    request(app)
      .post('/api/auth/login')
      .send(unhashedPasswordUser)
      .then((response) => {
        sender = response.body.user; // save the sender
        // console.log('##################');
        // console.log(sender);
        // console.log('##################');
        const newUser = {   // create the recipient user and save it for later use.
          email: 'fines.robert@gmail.com',
          password: 'testing'
        };
        request(app)
          .post('/api/users')
          .send(newUser)
          .then((res) => {
            recipient = res.body.user;
            // console.log('##################');
            // console.log(recipient);
            // console.log('##################');
            done();
          })
          .catch((e) => {
            console.log(e); //eslint-disable-line
            done(e);
          });
      })
      .catch((e) => {
        done(e);
      });
  });
  describe('# POST /api/conversations', () => {
    it('should create a new conversation', (done) => {
      conversation = {
        messages: [{
          body: 'testing conversations',
          recipient: recipient._id,
          createdAt: new Date(),
          createdBy: sender._id
        }],
        participants: [sender._id, recipient._id],
        createdBy: sender._id
      };
      request(app)
        .post('/api/conversations')
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .send(conversation)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.createdBy._id).to.equal(sender._id);
          expect(res.body.participants.length).to.equal(2);
          expect(res.body.messages.length).to.equal(1);
          conversation = res.body;
          message = conversation.messages[0];
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# GET /api/conversations/users/:userId', () => {
    it('should list a users conversations', (done) => {
      request(app)
        .get(`/api/conversations/users/${sender._id}`)
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.length).to.equal(1);
          expect(res.body[0].participants.length).to.equal(2);
          expect(res.body[0].messages.length).to.equal(1);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# PUT /api/conversations/:conversationId', () => {
    it('should update a conversation by adding a new message', (done) => {
      const updated = {
        message: {
          body: 'another message',
          recipient: sender._id,
          createdBy: recipient._id,
          createdAt: new Date(),
        }
      };
      request(app)
        .put(`/api/conversations/${conversation._id}`)
        .set('Authorization', `Bearer:${recipient.status.activeToken}`)
        .send(updated)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.messages.length).to.equal(2);
          expect(res.body.messages[1].createdBy._id).to.equal(recipient._id);
          message2 = res.body.messages[1];
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# PUT /api/conversations/:conversationId/messages/:messageId', () => {
    it('should update a message in a conversation', (done) => {
      const updated = {
        message: {
          body: 'message updated',
        }
      };
      request(app)
        .put(`/api/conversations/${conversation._id}/messages/${message._id}`)
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .send(updated)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.messages.length).to.equal(2);
          expect(res.body.messages[0].body).to.equal('message updated');
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should remove a message from a conversation', (done) => {
      request(app)
        .delete(`/api/conversations/${conversation._id}/messages/${message2._id}`)
        .set('Authorization', `Bearer:${recipient.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.messages.length).to.equal(1);
          expect(res.body.messages[0].createdBy._id).to.equal(sender._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# DELETE /api/conversations/:conversationId', () => {
    it('should remove a conversation', (done) => {
      request(app)
        .delete(`/api/conversations/${conversation._id}`)
        .set('Authorization', `Bearer:${recipient.status.activeToken}`)
        .expect(httpStatus.OK)
        .then(() => {
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
});
