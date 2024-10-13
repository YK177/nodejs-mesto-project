import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import Card from '../models/card';
import { AuthContext } from '../types/auth';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

const CARD_NOT_FOUND_MESSAGE = 'Карточка с указанным _id не найдена.';
const INVALID_CARD_DATA_MESSAGE = 'Переданы некорректные данные при создании карточки.';
const UNLISTED_CARD_ID_MESSAGE = 'Передан несуществующий _id карточки.';
const INVALID_LIKE_DATA_MESSAGE = 'Переданы некорректные данные для постановки/снятии лайка.';
const NOT_ALLOWED_TO_DELETE_CARD = 'Недостаточно прав для удаления карточки';
const CARD_DELETED_SUCCESSFULLY = 'Карточка удалена';

export const getCards = (_req:Request, res:Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch((error) => next(error));

export const createCard = (req:Request, res:Response<unknown, AuthContext>, next: NextFunction) => {
  const owner = res.locals.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_CARD_DATA_MESSAGE));
      }
      return next(error);
    });
};

export const deleteCard = (req:Request, res:Response<unknown, AuthContext>, next: NextFunction) => {
  const { user } = res.locals;
  const { cardId } = req.params;

  Card.findById({ _id: cardId })
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== user._id) {
        throw new ForbiddenError(NOT_ALLOWED_TO_DELETE_CARD);
      }
      return Card.deleteOne({ _id: card._id });
    })
    .then(() => res.status(constants.HTTP_STATUS_NO_CONTENT).send(CARD_DELETED_SUCCESSFULLY))
    .catch((error) => {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        return next(new NotFoundError(CARD_NOT_FOUND_MESSAGE));
      }
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

export const likeCard = (req:Request, res:Response<unknown, AuthContext>, next: NextFunction) => {
  const userId = res.locals.user._id;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        return next(new NotFoundError(UNLISTED_CARD_ID_MESSAGE));
      }
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError(error.message));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_LIKE_DATA_MESSAGE));
      }
      return next(error);
    });
};

export const dislikeCard = (
  req:Request,
  res:Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const userId = res.locals.user._id;
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        return next(new NotFoundError(UNLISTED_CARD_ID_MESSAGE));
      }
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError(error.message));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(INVALID_LIKE_DATA_MESSAGE));
      }
      return next(error);
    });
};
