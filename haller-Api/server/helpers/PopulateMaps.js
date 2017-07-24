const postsMap = [{
  path: 'createdBy',
  model: 'User'
}, {
  path: 'comments.createdBy',
  model: 'User',
}, {
  path: 'comments.starred.actedBy',
  model: 'User',
}, {
  path: 'comments.flagged.actedBy',
  model: 'User',
}, {
  path: 'liked.actedBy',
  model: 'User',
}, {
  path: 'starred.actedBy',
  model: 'User',
}, {
  path: 'flagged.actedBy',
  model: 'User'
}, {
  path: 'going.actedBy',
  model: 'User'
}, {
  path: 'cover',
  model: 'Library'
}, {
  path: 'comments.image',
  model: 'Library'
}];
export default { postsMap };
