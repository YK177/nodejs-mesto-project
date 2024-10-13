import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';

const AUTH_ERROR = 'Необходима авторизация';
const { SECRET_KEY = 'some-secret-key' } = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return next(new UnauthorizedError(AUTH_ERROR));
  }

  res.locals.user = payload;

  return next();
};

export default auth;
