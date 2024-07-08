import express from 'express';
import mongoose from 'mongoose';
import router from './routes';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mydb' } = process.env;

const app = express();

app.use(express.json());

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
