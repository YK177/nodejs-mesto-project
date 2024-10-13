import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import router from './routes';
import errorHandler from './middleware/error-handler';
import { createUser, getUsers, login } from './controllers/users';
import auth from './middleware/auth';
import { errorLogger, requestLogger } from './middleware/logger';
import { getCards } from './controllers/cards';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mydb' } = process.env;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);
app.post('/signup', createUser);
app.post('/signin', login);
app.get('/cards', getCards);
app.get('/users', getUsers);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

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
