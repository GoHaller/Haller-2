import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import User from '../models/user.model';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  console.log('After Hook'); //eslint-disable-line
  User.remove({}, () => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
    done();
  });
});
before((done) => {
  console.log('Before Hook'); //eslint-disable-line
  User.remove({}, () => done());
});
describe('## User APIs', () => {
  let user = {
    email: 'abc@mail.com',
    password: 'testing'
  };

  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.user.email).to.equal(user.email);
          user = res.body.user;
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# GET /api/users/:userId/verify-email', () => {
    it('should verify user email address', (done) => {
      request(app)
        .get(`/api/users/${user._id}/verify-email`)
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
  describe('# GET /api/users/individual/:email', () => {
    it('should get user details by email address', (done) => {
      request(app)
        .get(`/api/users/individual/${user.email}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        // .catch(done);
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
    it('should fail to get user details when an email is not found', (done) => {
      const email = 'testemail@email.com';
      request(app)
        .get(`/api/users/individual/${email}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        // .catch(done);
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        // .catch(done);
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  const userUpdate = {
    major: 'Computer Science',
    mobileNumber: 1234567890,
    residence: 'Oliver Hall',
    graduationYear: '2020',
    genderPronouns: ['He'],
    firstName: 'Robert',
    lastName: 'Fines',
    hometown: 'Kansas City'
  };
  describe('# PUT /api/users/:userId', () => {
    it('should update all user details', (done) => {
      request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(userUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('abc@mail.com');
          expect(res.body.mobileNumber).to.equal(userUpdate.mobileNumber);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# PUT /api/users/:userId', () => {
    const partialUpdate = {
      firstName: 'Billy'
    };
    it('should update first name of user without losing any existing values', (done) => {
      request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(partialUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('abc@mail.com');
          expect(res.body.firstName).to.equal(partialUpdate.firstName);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# PUT /api/users/:userId', () => {
    const partialUpdate = {
      lastName: 'LastName'
    };
    it('should update last name of user without losing any existing values', (done) => {
      request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(partialUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.residence).to.equal(userUpdate.residence);
          expect(res.body.lastName).to.equal(partialUpdate.lastName);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# PUT /api/users/:userId', () => {
    const partialUpdate = {
      residence: 'Test Hall'
    };
    it('should update residence of user without losing any existing values', (done) => {
      request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(partialUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.residence).to.equal(partialUpdate.residence);
          expect(res.body.lastName).to.equal('LastName');
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# PUT /api/users/:userId', () => {
    const partialUpdate = {
      major: 'Marketing'
    };
    it('should update major of user without losing any existing values', (done) => {
      request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .send(partialUpdate)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.residence).to.equal('Test Hall');
          expect(res.body.major).to.equal(partialUpdate.major);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });
  describe('# GET /api/users/:residence', () => {
    const partialUpdate = {
      residence: 'Test Hall'
    };
    it('should get all users living in the same residence', (done) => {
      request(app)
        .get(`/api/users/residence/${partialUpdate.residence}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0].residence).to.equal('Test Hall');
          done();
        })
        .catch((e) => {
          console.log(e); //eslint-disable-line
          done(e);
        });
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer:${user.status.activeToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('abc@mail.com');
          expect(res.body.mobileNumber).to.equal(userUpdate.mobileNumber);
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  });
});
