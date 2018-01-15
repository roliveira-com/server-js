import {Request, Response} from 'express';
import {User, users} from './users';

import * as jwt from 'jsonwebtoken';
import {config} from './api.config';

export const handleAuth = (req: Request, resp: Response) => {
  const user: User = req.body;
  if ( isValid(user) ) {
    const dbUser = users[user.email];
    const token = jwt.sign({sub: dbUser.email, iss: 'rango-api'}, config.secret);
    resp.status(200).json({
      name: dbUser.name,
      email: dbUser.email,
      token: token
    })
  }else {
    resp.status(403).json({message: 'Dados Inválidos'})
  }
};

function isValid(user: User): boolean {
  if(!user) {
    return false;
  }

  const dbUser = users[user.email];
  return dbUser !== undefined && dbUser.matches(user);
};
