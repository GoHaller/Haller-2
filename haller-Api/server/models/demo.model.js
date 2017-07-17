import 'mongoose-type-email';
import sanitizeHtml from 'sanitize-html';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';



const DemoSchema = new mongoose.Schema({
}, { strict: false })


export default mongoose.model('Demo', DemoSchema);