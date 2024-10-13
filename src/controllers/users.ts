import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import { AuthContext } from '../types/auth';
import ConflictError from '../errors/conflict-error';

const USER_NOT_FOUND_MESSAGE = 'Пользователь по указанному _id не найден.';
const INVALID_USER_DATA_MESSAGE = 'Переданы некорректные данные при создании пользователя.';
const EXISTED_USER_ERROR_MESSAGE = 'Пользователь с таким email уже зарегистрирован.';
const SALT_ROUNDS = 10;
const { SECRET_KEY = 'some-secret-key', TOKEN_EXPIRES_IN = '7d', COOKIE_EXPIRES_IN = 604800000 } = process.env;

export const login = (req:Request<{}, {}, IUser>, res:Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN });
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: +COOKIE_EXPIRES_IN,
      });
      res.send(user);
    })
    .catch((error) => next(error));
};

export const getUsers = (_req:Request, res:Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch((error) => next(error));

export const getUserById = (req:Request, res:Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findOne({ _id: userId })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        return next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
      }
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

export const createUser = async (req:Request<{}, {}, IUser>, res:Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  User
    .create({
      name, about, avatar, email, password: hash,
    })
    .then((user) => {
      res.status(constants.HTTP_STATUS_CREATED).send(user);
    })
    .catch((error) => {
      if (error instanceof Error && error.message.startsWith('E11000')) {
        return next(new ConflictError(EXISTED_USER_ERROR_MESSAGE));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};

export const updateProfile = (
  req:Request,
  res:Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { _id } = res.locals.user;
  const { name, about } = req.body;

  User
    .findByIdAndUpdate({ _id }, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        return next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
      }
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError(error.message));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};

export const updateAvatar = (
  req:Request,
  res:Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { _id } = res.locals.user;
  const { avatar } = req.body;

  User
    .findByIdAndUpdate({ _id }, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        return next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
      }
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError(error.message));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};
