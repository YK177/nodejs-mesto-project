import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import NotFoundError from '../errors/not-found-error';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (_req, _res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default router;
