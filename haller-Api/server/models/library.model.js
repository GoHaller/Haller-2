import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const populateMap = () =>
  [{
    path: 'createdBy',
    model: 'User'
  }];
const LibrarySchema = new mongoose.Schema({
  // {
  //   url: 'http://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
  //   secure_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
  //   public_id: 'sample',
  //   version: '1312461204',
  //   width: 864,
  //   height: 564,
  //   format: 'jpg',
  //   created_at: '2015-10-10T09:55:32Z',
  //   resource_type: 'image',
  //   tags: [],
  //   bytes: 9597,
  //   type: 'upload',
  //   etag: 'd1ac0ee70a9a36b14887aca7f7211737',
  //   signature: 'abcdefgc024acceb1c1baa8dca46717137fa5ae0c3',
  //   original_filename: 'sample'
  // }
  _id: {
    type: mongoose.Schema.ObjectId,
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  url: String,
  secure_url: String,
  public_id: String,
  version: String,
  width: Number,
  height: Number,
  format: String,
  created_at: Date,
  resource_type: String,
  tags: [String],
  bytes: Number,
  type: String,
  etag: String,
  signature: String,
  original_filename: String
});
/**
 * Statics
 */
LibrarySchema.statics = {
  /**
   * Get Library Object
   * @param {ObjectId} id - The objectId of Library.
   * @returns {Promise<Library, APIError>}
   */
  get(id) {
    try {
      if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
        const objectId = mongoose.Types.ObjectId(id); //eslint-disable-line
        return this.findById(objectId)
          .exec()
          .then((lib) => {
            // if (lib) {
            return lib;
            // }
            // const err = new APIError('No such library item exists!', httpStatus.NOT_FOUND);
            // return Promise.reject(err);
          })
          .error(err => Promise.reject(err))
          .catch(err => Promise.reject(err));
      }
    } catch (exc) {
      console.log(exc);
    }
    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },
  listByUserId({ userId, skip = 0, limit = 100 }) { //eslint-disable-line
    /* Paginate this endpoint */
    try {
      if (userId.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
        const objectId = mongoose.Types.ObjectId(userId); //eslint-disable-line
        const q = { createdBy: userId };
        return this.find(q)
          .populate(populateMap())
          .exec()
          .then((libs) => {
            if (libs) {
              return libs;
            }
            const err = new APIError('No library items exist for this user!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
          })
          .error(err => Promise.reject(err))
          .catch(err => Promise.reject(err));
      }
    } catch (exc) {
      console.log(exc);
    }
    const err = new APIError('Invalid Id!', httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  },
};
export default mongoose.model('Library', LibrarySchema);
