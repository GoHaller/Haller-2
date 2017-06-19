import _ from 'lodash';
import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import Post from '../models/post.model';
import Library from '../models/library.model';


chai.config.includeStack = true;
const postsCreated = [];
let coversCreated = [];
let post = {};
let event = {};
let user = {};
let star = {};
let flag = {};
let comment = {};
let starComment = {};
let flagComment = {};
let cover = {
  url: 'http://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
  secure_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
  public_id: 'sample',
  version: '1312461204',
  width: 864,
  height: 564,
  format: 'jpg',
  created_at: '2015-10-10T09:55:32Z',
  resource_type: 'image',
  tags: [],
  bytes: 9597,
  type: 'upload',
  etag: 'd1ac0ee70a9a36b14887aca7f7211737',
  signature: 'abcdefgc024acceb1c1baa8dca46717137fa5ae0c3',
  original_filename: 'sample'
};

describe('## Post APIs', () => {
  before((done) => {
    const unhashedPasswordUser = {
      email: 'abcdef@gmail.com',
      password: 'testing'
    };
    request(app)
      .post('/api/auth/login')
      .send(unhashedPasswordUser)
      .then((response) => {
        user = response.body.user;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  after((done) => {
    Post.remove({}, () => { //eslint-disable-line
      Library.remove({}, () => { done(); }); //eslint-disable-line
    });
  });
  describe('# POST /api/posts', () => {
    it('should create a new post with no images', (done) => {
      post = {
        details: 'testing posts',
        createdBy: user._id,
        isEvent: false,
        authorResidence: user.residence,
        residentsFeed: false,
        discoveryFeed: false,
      };
      request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(post)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.details).to.equal('testing posts');
          expect(res.body.createdBy._id).to.equal(user._id);
          postsCreated.push(res.body);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should create a new post with a single image', (done) => {
      post = {
        details: 'testing posts',
        createdBy: user._id,
        isEvent: false,
        authorResidence: user.residence,
        residentsFeed: false,
        discoveryFeed: false,
        cover: [_.extend(cover, { createdBy: user._id })]
      };
      request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(post)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.details).to.equal('testing posts');
          expect(res.body.createdBy._id).to.equal(user._id);
          expect(res.body.cover.length).to.equal(1);
          coversCreated.push(res.body.cover[0]);
          postsCreated.push(res.body);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should create a new post with multiple images', (done) => {
      post = {
        details: 'testing posts',
        createdBy: user._id,
        isEvent: false,
        authorResidence: user.residence,
        residentsFeed: false,
        discoveryFeed: false,
        cover: [_.extend(cover, { createdBy: user._id }), _.extend(cover, { createdBy: user._id })]
      };
      request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(post)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.details).to.equal('testing posts');
          expect(res.body.createdBy._id).to.equal(user._id);
          expect(res.body.cover.length).to.equal(2);
          cover = res.body.cover[0];
          coversCreated.concat(res.body.cover);
          postsCreated.push(res.body);
          post._id = res.body._id;
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should update an existing post details', (done) => {
      const postUpdate = {
        details: 'testing posts update',
        cover: [cover]
      };
      request(app)
        .put(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(postUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          coversCreated.push(res.body.cover[2]);
          expect(res.body.details).to.equal('testing posts update');
          expect(res.body.cover.length).to.equal(3);
          expect(res.body.createdBy._id).to.equal(user._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should list posts', (done) => {
      request(app)
        .get('/api/posts/')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.length).to.equal(3);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });

    it('should list posts by residence', (done) => {
      request(app)
        .get(`/api/posts/residence/${post.authorResidence}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.length).to.equal(3);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should list discovery posts', (done) => {
      let discoveryPost = new Post({
        _id: mongoose.Types.ObjectId(), //eslint-disable-line
        title: 'discovery post',
        details: 'discovery',
        createdBy: user._id,
        authorResidence: user.residence,
        residentsFeed: false,
        isEvent: false,
        discoveryFeed: true,
      });

      discoveryPost.save().then((discPost) => {
        discoveryPost = discPost;
        request(app)
          .get(`/api/posts/${user._id}/feeds/discovery`)
          .set('Authorization', `Bearer:${user.status.activeToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0].details).to.equal('discovery');
            discoveryPost.remove().then(() => done());
          })
          .catch((e) => {
            console.log(e); //eslint-disable-line
            done(e);
          });
      });
    });
    it('should list residents feed posts', (done) => {
      let residentsPost = new Post({
        _id: mongoose.Types.ObjectId(), //eslint-disable-line
        details: 'residents',
        createdBy: user._id,
        authorResidence: user.residence,
        residentsFeed: true,
        isEvent: false,
        discoveryFeed: false,
      });

      residentsPost.save().then((discPost) => {
        residentsPost = discPost;
        request(app)
          .get(`/api/posts/${user._id}/feeds/residents`)
          .set('Authorization', `Bearer:${user.status.activeToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0].details).to.equal('residents');
            residentsPost.remove().then(() => done());
          })
          .catch((e) => {
            console.log(e); //eslint-disable-line
            done(e);
          });
      });
    });
    it('should list posts by user._id', (done) => {
      request(app)
        .get(`/api/posts/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.length).to.equal(3);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should retrieve post by post._id', (done) => {
      request(app)
        .get(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body._id).to.equal(post._id);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Stand Alone Library Test /api/posts/library', () => {
    it('should list library items by user id', (done) => {
      request(app)
        .get(`/api/posts/library/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.length).to.equal(4);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should add stand alone image', (done) => {
      const newCover = cover;
      delete newCover._id;
      request(app)
        .post('/api/posts/library')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send({ library: _.extend(newCover, { createdBy: user._id }) })
        .expect(httpStatus.OK)
        .then((res) => {
          coversCreated.push(res.body);
          expect(res.body.url).to.equal(cover.url);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should remove a stand alone image', (done) => {
      request(app)
        .delete(`/api/posts/library/${coversCreated[0]._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then(() => {
          coversCreated = coversCreated.slice(1);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Flag Post Tests /api/posts/:postId/flags', () => {
    it('should flag a post', (done) => {
      flag = {
        actedBy: user._id,
        actionType: 'flag',
      };
      request(app)
        .post(`/api/posts/${post._id}/flags`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(flag)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.flagged.length).to.equal(1);
          expect(res.body.flagged[0].actedBy._id).to.equal(flag.actedBy);
          post = res.body;
          flag = res.body.flagged[0];
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Remove Flag from Post Tests /api/posts/:postId/flags/:flagId', () => {
    it('should remove a flag from a post', (done) => {
      request(app)
        .delete(`/api/posts/${post._id}/flags/${flag._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.flagged.length).to.equal(0);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Remove Cover from Post Tests /api/posts/:postId/cover/:coverId', () => {
    it('should remove a cover image from a post', (done) => {
      console.log(coversCreated);
      request(app)
        .delete(`/api/posts/${post._id}/cover/${coversCreated[0]._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.cover.length).to.equal(post.cover.length - 1);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('##Post Starring Tests /api/posts/:postId/stars', () => {
    it('should star a post', (done) => {
      star = {
        actedBy: user._id,
        actionType: 'star'
      };
      request(app)
        .post(`/api/posts/${post._id}/stars`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(star)
        .expect(httpStatus.OK)
        .then((res) => {
          star = res.body.starred[0];
          expect(res.body.starred.length).to.equal(1);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should un-star a post', (done) => {
      request(app)
        .delete(`/api/posts/${post._id}/stars/${star._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(star)
        .expect(httpStatus.OK)
        .then((res) => {
          star = res.body.starred[0];
          expect(res.body.starred.length).to.equal(0);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('##Post Comment Tests /api/posts/:postId/comments', () => {
    it('should add a comment to a post', (done) => {
      comment = {
        body: 'comment1',
        createdBy: user._id,
        createdAt: new Date()
      };
      request(app)
        .post(`/api/posts/${post._id}/comments`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(comment)
        .expect(httpStatus.OK)
        .then((res) => {
          comment = res.body.comments[0];
          expect(res.body.comments.length).to.equal(1);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should update a comment on a post', (done) => {
      let updatedComment = {
        body: 'comment updated'
      };
      request(app)
        .put(`/api/posts/${post._id}/comments/${comment._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(updatedComment)
        .expect(httpStatus.OK)
        .then((res) => {
          updatedComment = res.body.comments[0];
          expect(res.body.comments.length).to.equal(1);
          expect(updatedComment.body).to.equal('comment updated');
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Star Post Comment Tests /api/posts/:postId/comments/:commentId/stars', () => {
    it('should star a comment on a post', (done) => {
      starComment = {
        actedBy: user._id,
        actionType: 'star',
      };
      request(app)
        .post(`/api/posts/${post._id}/comments/${comment._id}/stars`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(starComment)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.comments.length).to.equal(1);
          expect(res.body.comments[0].starred.length).to.equal(1);
          expect(res.body.comments[0].starred[0].actedBy._id).to.equal(starComment.actedBy);
          starComment = res.body.comments[0].starred[0];
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Remove Star from Post Comment Tests /api/posts/:postId/comments/:commentId/stars/:starId', () => {
    it('should remove a star on a comment on a post', (done) => {
      request(app)
        .delete(`/api/posts/${post._id}/comments/${comment._id}/stars/${starComment._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.comments.length).to.equal(1);
          expect(res.body.comments[0].starred.length).to.equal(0);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Flag Post Comment Tests /api/posts/:postId/comments/:commentId/flags', () => {
    it('should flag a comment on a post', (done) => {
      flagComment = {
        actedBy: user._id,
        actionType: 'flag',
      };
      request(app)
        .post(`/api/posts/${post._id}/comments/${comment._id}/flags`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(flagComment)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.comments.length).to.equal(1);
          expect(res.body.comments[0].flagged.length).to.equal(1);
          expect(res.body.comments[0].flagged[0].actedBy._id).to.equal(flagComment.actedBy);
          flagComment = res.body.comments[0].flagged[0];
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Remove Flag from Post Comment Tests /api/posts/:postId/comments/:commentId/flags/:flagId', () => {
    it('should remove a star on a comment on a post', (done) => {
      request(app)
        .delete(`/api/posts/${post._id}/comments/${comment._id}/flags/${flagComment._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.comments.length).to.equal(1);
          expect(res.body.comments[0].flagged.length).to.equal(0);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Remove Post Comment Tests /api/posts/:postId/comments/:commentId', () => {
    it('should remove a comment from a post', (done) => {
      request(app)
        .delete(`/api/posts/${post._id}/comments/${comment._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.comments.length).to.equal(0);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# POST /api/events', () => {
    it('should create a new event', (done) => {
      event = {
        title: 'Event test',
        details: 'testing events',
        createdBy: user._id,
        isEvent: true,
        authorResidence: user.residence,
        residentsFeed: false,
        discoveryFeed: false,
        date: new Date(new Date().getTime() + 100000),
        time: new Date(new Date().getTime() + 100000),
      };
      request(app)
        .post('/api/events')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(event)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.details).to.equal('testing events');
          expect(res.body.createdBy._id).to.equal(user._id);
          event._id = res.body._id;
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('## Event Tests /api/events/:eventId', () => {
    it('should update an existing event details', (done) => {
      const eventUpdate = {
        details: 'testing events update',
        date: new Date(new Date().getTime() + 100000)
      };
      request(app)
        .put(`/api/events/${event._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(eventUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.details).to.equal('testing events update');
          expect(new Date(res.body.date).getTime()).to.equal(eventUpdate.date.getTime());
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should remove an existing event', (done) => {
      request(app)
        .delete(`/api/events/${event._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
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
  describe('## Remove Post Test /api/posts/:postId', () => {
    it('should delete posts by _id', (done) => {
      request(app)
        .delete(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.createdBy._id).to.equal(user._id);
          expect(res.body.details).to.equal('testing posts update');
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
});
