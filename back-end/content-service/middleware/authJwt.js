const { verifyToken } = require('../utils/jwt');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = verifyToken(token);
    req.user = { userId: payload.userId };
    req.token = token;  // on le repasse pour axios
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};