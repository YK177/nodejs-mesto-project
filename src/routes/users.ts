import { Router } from 'express';
import { createUser, getUserById, getUsers } from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);

export default usersRouter;
