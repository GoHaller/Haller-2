export default {
  rootUrl: 'https://haller-api-v2.herokuapp.com/api/',
  env: 'production',
  jwtSecret: '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
  db: 'mongodb://haller:Haller2017@ds113219-a0.mlab.com:13219,ds113219-a1.mlab.com:13219/haller-app-main?replicaSet=rs-ds113219',
  mailgun: {
    key: 'key-123e941659eb0511afc01ddf7b60df3a',
    domain: 'mg.gohaller.com'
  },
  inviteCode: 'hallerku!'
};
