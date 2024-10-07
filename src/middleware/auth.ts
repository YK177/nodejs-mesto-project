import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';

const AUTH_ERROR = 'Необходима авторизация';
const BEARER = 'Bearer ';
const { SECRET_KEY = 'some-secret-key' } = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith(BEARER)) {
    return next(new UnauthorizedError(AUTH_ERROR));
  }

  const token = authorization.replace(BEARER, '');

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return next(new UnauthorizedError(AUTH_ERROR));
  }

  res.locals.user = {
    _id: payload,
  };

  return next();
};

export default auth;
