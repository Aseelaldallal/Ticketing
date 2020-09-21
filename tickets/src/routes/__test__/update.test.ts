import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'Valid Title',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Valid Title',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if user does not own ticket', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signup()).send({
    title: 'Valid Title',
    price: 20,
  });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'Valid Title',
      price: 20,
    })
    .expect(401);
});

it('returns a 400 if user provides invalid title or price', async () => {
  const cookie = global.signup();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Valid Title',
    price: 20,
  });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Valid Title',
      price: -20,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signup();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Valid Title',
    price: 20,
  });
  const updatedTitle = 'Another Valid Title';
  const updatedPrice = 39;
  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);
  expect(updateTicketResponse.body.title).toEqual(updatedTitle);
  expect(updateTicketResponse.body.price).toEqual(updatedPrice);
  const getTicketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();
  expect(getTicketResponse.body.title).toEqual(updatedTitle);
  expect(getTicketResponse.body.price).toEqual(updatedPrice);
});
