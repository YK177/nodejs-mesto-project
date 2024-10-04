import { Router } from 'express';
import { constants } from 'http2';
import usersRouter from './users';
import cardsRouter from './cards';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((_req, res, _next) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Запрашиваемый ресурс не найден' }));

export default router;
