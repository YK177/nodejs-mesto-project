import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (_req:Request, res:Response) => Card.find({})
  .then((cards) => res.send(cards));

export const createCard = (req:Request, res:Response) => {
  const { name, link } = req.body;
  const owner = res.locals.user;

  Card.create({ name, link, owner })
    .then((card) => res.send(card));
};

export const deleteCard = (req:Request, res:Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete({ _id: cardId }).then((card) => res.send(card));
};
