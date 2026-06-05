const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  return next();
};

const setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
};

module.exports = {
  requireAuth,
  setCurrentUser
};
