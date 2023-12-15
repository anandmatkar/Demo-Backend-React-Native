import jsonwebtoken from 'jsonwebtoken';

export const jwt = {
  issueJWT: async (user) => {
    let payload = {
      id: user._id,
      email: user.email,
    };

    const jwtToken = jsonwebtoken.sign(payload, process.env.SECRET_KEY);
    return jwtToken;
  },

  verifyTokenAdmin: async (req, res, next) => {
    var token = req.headers.authorization;
    jsonwebtoken.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Session timed out. Please sign in again',
        });
      } else {
        req.user = {
          id: decoded.id,
          email: decoded.email,
        };
        return next();
      }
    });
  },
};
