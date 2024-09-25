import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (_req:Request, res:Response) => User.find({})
  .then((users) => res.send(users));

export const getUserById = (req:Request, res:Response) => {
  const { userId } = req.params;

  return User.findOne({ _id: userId }).then((user) => res.send(user));
};

export const createUser = (req:Request, res:Response) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send(user));
};

export const updateProfile = (req:Request, res:Response) => {
  const userId = res.locals.user;
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user));
};

export const updateAvatar = (req:Request, res:Response) => {
  const userId = res.locals.user;
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user));
};
