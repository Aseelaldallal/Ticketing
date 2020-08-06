import mongoose from 'mongoose';

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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
