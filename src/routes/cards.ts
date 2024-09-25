import { Router } from 'express';
import { createCard, deleteCard, getCards } from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);

export default cardsRouter;
