import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUserById, updateAvatar, updateProfile, getMe,
} from '../controllers/users';
import {

  getUserSchema,
  updateAvatarSchema,
  updateProfileSchema,
} from '../validators/user';

const usersRouter = Router();

usersRouter.get('/me', getMe);
usersRouter.get('/:userId', celebrate(getUserSchema), getUserById);
usersRouter.patch('/me', celebrate(updateProfileSchema), updateProfile);
usersRouter.patch('/me/avatar', celebrate(updateAvatarSchema), updateAvatar);

export default usersRouter;
