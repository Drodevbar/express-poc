const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../../sequelize').models;
const { tokenService } = require('../../service/token');
const { tokenStatus } = require('../../enum/token-status');

router.post('/token', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      message: 'Provide valid email and password values',
    });
  }

  const user = await User.findOne({ where: { email } });

  if (user !== null) {
    if (!bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({
        message: 'Given password does not match',
      });
    }

    if (tokenService.getTokenDetails(user.token).status === tokenStatus.EXPIRED) {
      const newToken = tokenService.generate(email);
      user.token = newToken;
      await user.save();
    }

    return res.status(200).json({
      token: user.token,
    });
  }

  const newUser = User.build({
    email,
    token: tokenService.generate(email),
    passwordHash: bcrypt.hashSync(password),
  });
  await newUser.save();

  return res.status(201).json({
    token: newUser.token,
  });
});

module.exports = router;
