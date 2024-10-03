import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

const USER_NOT_FOUND_MESSAGE = 'Пользователь по указанному _id не найден.';
const INVALID_USER_DATA_MESSAGE = 'Переданы некорректные данные при создании пользователя.';

export const getUsers = (_req:Request, res:Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch((error) => next(error));

export const getUserById = (req:Request, res:Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findOne({ _id: userId })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        return next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
      }
      return next(error);
    });
};

export const createUser = (req:Request, res:Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};

export const updateProfile = (req:Request, res:Response, next: NextFunction) => {
  const userId = res.locals.user;
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        return next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};

export const updateAvatar = (req:Request, res:Response, next: NextFunction) => {
  const userId = res.locals.user;
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        return next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_USER_DATA_MESSAGE));
      }
      return next(error);
    });
};
