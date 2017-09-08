import path from 'path';

// console.log('process.env', process.env)
const env = process.env.NODE_ENV || 'development';//'staging';//'production';//'development';
const config = require(`./${env}`); // eslint-disable-line import/no-dynamic-require
// console.info('env', env);
const defaults = {
  root: path.join(__dirname, '/..')
};

export default Object.assign(defaults, config);
