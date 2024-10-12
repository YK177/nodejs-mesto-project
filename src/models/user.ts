import mongoose, { Model, Schema, Document } from 'mongoose';
import { isEmail, isURL } from 'validator';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../errors/unauthorized-error';

const CREDENTIALS_ERROR = 'Неправильные почта или пароль';

export interface IUser {
  name: string;
  email: string,
  password: string,
  about: string;
  avatar: string;
}

interface IUserDocument extends Document, IUser {}
interface IUserModel extends Model<IUserDocument> {
  findUserByCredentials(_email: string, _password: string): Promise<IUserDocument>;
}

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Некорректный email',
    },
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [200, 'Максимальная длина поля "name" - 200'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, {
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      const { password: _, ...user } = ret;
      return user;
    },
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password')
    .then((user: IUser) => {
      if (!user) {
        throw new UnauthorizedError(CREDENTIALS_ERROR);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(CREDENTIALS_ERROR);
          }

          return user;
        });
    });
});

export default mongoose.model<IUserDocument, IUserModel>('user', userSchema);
