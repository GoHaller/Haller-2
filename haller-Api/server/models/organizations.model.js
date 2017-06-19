import 'mongoose-type-email';
import sanitizeHtml from 'sanitize-html';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


const OrganizationSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        index: true,
    },
    name: {
        type: String,
        required: true,
        text: true
    },
    detail: {
        type: String
    },
})


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
OrganizationSchema.method({
});

OrganizationSchema.statics = {
    getByName(name) {
        return this.find({ name: { $regex: '^' + name, $options: 'i' } }).limit(10)
            .exec()
            .then((organozations) => {
                if (organozations) {
                    return organozations;
                }
                const err = new APIError('No such organization exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },
}

export default mongoose.model('Organization', OrganizationSchema);