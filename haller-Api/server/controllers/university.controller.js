import httpStatus from 'http-status';
import mongoose from 'mongoose';
import University from '../models/university.model';
import APIError from '../helpers/APIError';


/**
 * Get user by Id
 * @returns {User}
 */
function getById(req, res, next) {
  console.log(req.params);
  University.get(req.params.id)
    .then(university => res.json(university))
    .error(e => next(e))
    .catch((e) => {
      next(e);
    });
}

function create(req, res, next) {
  const university = new User({
    _id: mongoose.Types.ObjectId(), //eslint-disable-line
    email: req.body.email,
    name: req.body.name,
    website: req.body.website
  });
  university.save()
    .then((savedUniversity) => {
      res.send(savedUniversity);
    }).catch((exc) => {
      next(exc);
    });
}

export default { getById, create };
