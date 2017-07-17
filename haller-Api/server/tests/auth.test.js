import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import User from '../models/user.model';

const bcrypt = require('bcryptjs');

chai.config.includeStack = true;
let user = new User({
  _id: mongoose.Types.ObjectId(), //eslint-disable-line
  email: 'abcdef@gmail.com',
  password: bcrypt.hashSync('testing', 10),
  residence: 'Oliver'
});
/**
 * root level hooks
 */
after((done) => {
  User.remove({}, () => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
    done();
  });
});
before(() => {
  User.remove({}, () => {
    user.save()
    .catch((e) => {
      console.log(e); // eslint-disable-line
    });
  });
});
describe('## Auth APIs', () => {
  describe('# LOGIN /api/auth/login', () => {
    it('should return token after successful login', (done) => {
      const unhashedPasswordUser = {
        email: user.email,
        password: 'testing'
      };
      request(app)
        .post('/api/auth/login')
        .send(unhashedPasswordUser)
        .expect(httpStatus.OK)
        .then((response) => {
          expect(response.body.user.email).to.equal(user.email);
          expect(response.body.token).to.be.a('string');
          user = response.body.user;
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
    it('should return http.UNAUTHORIZED after unsuccessful login', (done) => {
      const tempUser = user;
      tempUser.password = 'nadda';
      request(app)
        .post('/api/auth/login')
        .send(tempUser)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });
  describe('#RANDOM NUMBER /api/auth/random-number', () => {
    it('should return an error when no token is set', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .send(user)
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
    it('should return a random number when Authorization header is set', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((response) => {
          expect(response.body.num).to.be.a('number');
          expect(response.body.user.email).to.equal(user.email);
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });
  describe('## Auth API Logout -- should set appropriate user status variables.', () => {
    it('should log a user out by clearing the active token and setting appropriate status variables', (done) => {
      request(app)
        .get(`/api/auth/logout/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then(() => {
          User.get(user._id).then((u) => {
            expect(u.status.online).to.equal(false);
            expect(u.status.currentStatus).to.equal('offline');
            expect(u.status.activeToken).to.equal(null);
            done();
          });
        })
        .catch((e) => {
          done(e);
        });
    });
  });
});
