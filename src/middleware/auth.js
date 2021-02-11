const { tokenStatus } = require('../enum/token-status');
const { tokenService } = require('../service/token');
const { User } = require('../sequelize').models;

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  const tokenDetails = tokenService.getTokenDetails(token);

  if (tokenDetails.status !== tokenStatus.VALID) {
    return res.status(401).json({
      message: `${tokenDetails.status} token provided`,
    });
  }

  const userEmail = tokenDetails.payload.email;
  const user = await User.findOne({ where: { email: userEmail } });

  if (user === null) {
    return res.status(404).json({
      message: 'User for this token not found',
    });
  }

  req.user = user;

  next();
};
