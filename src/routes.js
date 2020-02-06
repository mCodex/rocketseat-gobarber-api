import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const newUser = await User.create({
    name: 'Hi',
    email: 'mateus@teste.com',
    password_hash: '1234',
  });

  res.json(newUser);
});

export default routes;
