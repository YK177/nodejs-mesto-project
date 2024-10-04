import mongoose, { Schema } from 'mongoose';
import { isURL } from 'validator';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [200, 'Максимальная длина поля "name" - 200'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'Некорректный URL',
    },
    required: true,
  },
}, { versionKey: false });

export default mongoose.model<IUser>('user', userSchema);
