export default {
  rootUrl: 'http://localhost:4040/api/',
  env: 'development',
  MONGOOSE_DEBUG: true,
  jwtSecret: '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
  db: 'mongodb://localhost:27017/haller-api-development',
  port: 4040,
  mailgun: {
    key: 'key-123e941659eb0511afc01ddf7b60df3a',
    domain: 'mg.gohaller.com'
  },
  websiteUrl: 'localhost:4200',
  inviteCode: 'gohallerku'
};
