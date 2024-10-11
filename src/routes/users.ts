import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';
import {
  getUserSchema,
  updateAvatarSchema,
  updateProfileSchema,
} from '../validators/user';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', celebrate(getUserSchema), getUserById);
usersRouter.patch('/me', celebrate(updateProfileSchema), updateProfile);
usersRouter.patch('/me/avatar', celebrate(updateAvatarSchema), updateAvatar);

export default usersRouter;
