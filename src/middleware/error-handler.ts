import { ErrorRequestHandler } from 'express';
import { constants } from 'http2';

const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка.';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
    ? DEFAULT_ERROR_MESSAGE
    : err.message;

  res.status(statusCode).json({ message });
};

export default errorHandler;
