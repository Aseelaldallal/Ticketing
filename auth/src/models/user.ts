import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties that
// are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that the
// User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An inteface that describes the properties that a user
// Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, // unrelated to typescript
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// If we use an arrow function inside, the value of 'this' inside
// the function will be overriden, and will equal the context of this
// entire file as opposed to the user
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    // Don't has an already hashed password
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
