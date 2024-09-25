import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes';
import type { AuthContext } from './types/auth';

const AUTH_MOCK_USER_ID = '66f1b23e747ec15f21dbe300';
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mydb' } = process.env;

const app = express();

app.use(express.json());

app.use((_req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: AUTH_MOCK_USER_ID,
  };

  next();
});

app.use(router);

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Соединение с базой установлено');

    await app.listen(PORT);
    console.log('Сервер запущен на порту:', PORT);
  } catch (err) {
    console.log(err);
  }
};

connect();
