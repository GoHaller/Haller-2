import mongoose from 'mongoose';
import util from 'util';
import config from './config/env';
import app from './config/express';
var http = require('https'); //importing http

const debug = require('debug')('haller-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

if (config.env !== 'development') {
  setInterval(function () {
    console.log('I am up at ', new Date());
    startKeepAlive();
  }, 15 * 60 * 1000);
}
function startKeepAlive() {
  http.request(config.rootUrl + 'health-check', (response) => {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('error', (err) => {
      console.log('error', err);
    })

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log('end', str);
    });
  }).end();
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  const port = process.env.PORT || config.port || 4133;
  console.info('port', port);
  app.listen(port, '0.0.0.0', () => {
    console.log(`server started on port ${port} (${config.env})`);
    debug(`de server started on port ${port} (${config.env})`);
  });
}

export default app;
