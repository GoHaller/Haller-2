import 'mongoose-type-email';
import sanitizeHtml from 'sanitize-html';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


const InterestSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        index: true,
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

InterestSchema.method({
});

InterestSchema.statics = {
    get() {
        return this.find({}).exec()
            .then((list) => {
                if (list) {
                    return list;
                }
                return [];
            })
            .error(err => Promise.reject(err))
            .catch(err => Promise.reject(err));
    },
    getByName(name) {
        return this.find({ name: { $regex: '^' + name, $options: 'i' } }).limit(10)
            .exec()
            .then((list) => {
                if (list) {
                    return list;
                }
                const err = new APIError('No such organization exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }
}

export default mongoose.model('Interest', InterestSchema);