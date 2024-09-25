import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (_req:Request, res:Response) => Card.find({})
  .then((cards) => res.send(cards));

export const createCard = (req:Request, res:Response) => {
  const owner = res.locals.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card));
};

export const deleteCard = (req:Request, res:Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete({ _id: cardId }).then((card) => res.send(card));
};

export const likeCard = (req:Request, res:Response) => {
  const userId = res.locals.user;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => res.send(card));
};

export const dislikeCard = (req:Request, res:Response) => {
  const userId = res.locals.user;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => res.send(card));
};
