import mongoose, { Schema } from 'mongoose';
import { isURL } from 'validator';

type User = {
  name: string;
  about: string;
  avatar: string;
}

interface ICard {
  name: string;
  link: string;
  owner: User;
  likes: Array<User>;
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  link: {
    type: String,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'Некорректный URL',
    },
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default mongoose.model<ICard>('card', cardSchema);
