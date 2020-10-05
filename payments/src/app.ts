import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gettix/common';
import { CreateChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== 'test', // cookies only used if user visiting app over https connection
  })
);

app.use(currentUser);

app.use(CreateChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
