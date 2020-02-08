import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schemaValidation = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const isValidPayload = await schemaValidation.isValid(req.body);

    if (!isValidPayload) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isCorrectPassword = await user.checkPassword(password);

    if (!isCorrectPassword) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
