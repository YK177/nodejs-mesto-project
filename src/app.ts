import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { celebrate, errors } from 'celebrate';
import router from './routes';
import errorHandler from './middleware/error-handler';
import { createUser, login } from './controllers/users';
import auth from './middleware/auth';
import headerSchema from './validators/header-schema';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mydb' } = process.env;

const app = express();

app.use(express.json());
app.use(helmet());
app.post('/signup', createUser);
app.post('/signin', login);
app.use(celebrate(headerSchema));
app.use(auth);
app.use(router);
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
