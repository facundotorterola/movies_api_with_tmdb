const auth = require('../../../auth');
const response = require('../../../network/response');

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    switch (action) {
      case 'logged':
        auth.check
          .logged(req)
          .then(() => {
            next();
          })
          .catch(() => {
            response.error(req, res, 'Unauthorized', 401);
          });

        break;
      default:
        next();
    }
  }

  return middleware;
};
