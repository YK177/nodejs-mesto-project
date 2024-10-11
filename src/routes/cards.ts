import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import { cardCommonActionsSchema, createCardSchema } from '../validators/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate(createCardSchema), createCard);
cardsRouter.delete('/:cardId', celebrate(cardCommonActionsSchema), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate(cardCommonActionsSchema), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate(cardCommonActionsSchema), dislikeCard);

export default cardsRouter;
