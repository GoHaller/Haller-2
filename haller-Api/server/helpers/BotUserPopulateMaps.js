const postsMap = [{
  path: 'createdBy',
  model: 'BotUser'
}, {
  path: 'comments.createdBy',
  model: 'BotUser',
}, {
  path: 'comments.starred.actedBy',
  model: 'BotUser',
}, {
  path: 'comments.flagged.actedBy',
  model: 'BotUser',
}, {
  path: 'liked.actedBy',
  model: 'BotUser',
}, {
  path: 'starred.actedBy',
  model: 'BotUser',
}, {
  path: 'flagged.actedBy',
  model: 'BotUser'
}, {
  path: 'going.actedBy',
  model: 'BotUser'
}, {
  path: 'cover',
  model: 'Library'
}, {
  path: 'comments.image',
  model: 'Library'
}];
export default { postsMap };
