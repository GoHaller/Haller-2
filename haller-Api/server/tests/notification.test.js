import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import User from '../models/user.model';
import Post from '../models/post.model';


chai.config.includeStack = true;
let post = {};
let notification = {};
let sender = {};
let recipient = {};
describe('## Notification APIs', () => {
  after((done) => {
    User.remove({ _id: recipient._id }).then(() =>
      Post.remove({ _id: post._id }).then(() => done()));
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
            post = {
              details: 'testing posts',
              createdBy: sender._id,
              isEvent: false,
              authorResidence: sender.residence,
              residentsFeed: false,
              discoveryFeed: false
            };
            request(app)
              .post('/api/posts')
              .set('Authorization', `Bearer:${sender.status.activeToken}`)
              .send(post)
              .then((r) => {
                post = r.body;
                done();
              })
              .catch((e) => {
                console.log(e); //eslint-disable-line
                done(e);
              });
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
  describe('# POST /api/notifications', () => {
    it('should create a new Notification', (done) => {
      notification = {
        body: 'test',
        createdBy: sender._id,
        actionTaken: 'star',
        objectId: post._id,
        objectType: 'Post',
        read: false,
        recipient: recipient._id,
        createdAt: new Date()
      };
      request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .send(notification)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.body).to.equal('test');
          expect(res.body.createdBy._id).to.equal(sender._id);
          notification = res.body;
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should list Notifications', (done) => {
      request(app)
        .get(`/api/notifications/users/${recipient._id}`)
        .set('Authorization', `Bearer:${recipient.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.length).to.equal(1);
          expect(res.body[0].createdBy._id).to.equal(sender._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should get a specific Notification', (done) => {
      request(app)
        .get(`/api/notifications/${notification._id}`)
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.body).to.equal('test');
          expect(res.body.createdBy._id).to.equal(sender._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should update a specific Notification to be read', (done) => {
      request(app)
        .put(`/api/notifications/${notification._id}`)
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .send({ read: true })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.read).to.equal(true);
          expect(res.body.createdBy._id).to.equal(sender._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should remove a Notification', (done) => {
      request(app)
        .delete(`/api/notifications/${notification._id}`)
        .set('Authorization', `Bearer:${sender.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.read).to.equal(true);
          expect(res.body.createdBy._id).to.equal(sender._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
});
