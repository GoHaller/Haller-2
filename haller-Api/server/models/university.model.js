import 'mongoose-type-email';
import sanitizeHtml from 'sanitize-html';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';


const UniversitySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
    },
    halls: {
        type: [String]
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    }
})

UniversitySchema.method({
});

UniversitySchema.statics = {
    /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
    get(id) {
        console.info('getId', id);
        try {
            if (id.toString().match(/^[0-9a-fA-F]{24}$/).length > 0) {
                const objectId = mongoose.Types.ObjectId(id); //eslint-disable-line
                return this.findOne({ '_id': objectId }, { otp: false })
                    // .populate(populateMap())
                    .exec()
                    .then((university) => {
                        if (university) {
                            return university;
                        }
                        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
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
    /**
   * Get user
   * @param {string} email - The email address of user.
   * @returns {Promise<User, APIError>}
   */
    getByEmail(email) {
        return this.findOne({ email: email })
            .populate(populateMap())
            .exec()
            .then((university) => {
                if (university) {
                    return university;
                }
                const err = new APIError('No such University exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },
}

export default mongoose.model('University', UniversitySchema);