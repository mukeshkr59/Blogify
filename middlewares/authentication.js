const { validateToken } = require("../services/authentication");
const User = require("../models/user");

function checkForauthenticationCookies(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      // Fetch the latest user data from DB
      const user = await User.findById(userPayload._id);
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    } catch (error) {}

    return next();
  };
}

module.exports = {
  checkForauthenticationCookies,
};
