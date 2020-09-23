import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').set('Cookie', global.signup()).send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if ticketId is not provided', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app).post('/api/orders').set('Cookie', global.signup()).send({}).expect(400);
});

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app).post('/api/orders').set('Cookie', global.signup()).send({ ticketId }).expect(404);
});

it('returns and erorr if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: '243242',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app).post('/api/orders').set('Cookie', global.signup()).send({ ticketId: ticket.id }).expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  await request(app).post('/api/orders').set('Cookie', global.signup()).send({ ticketId: ticket.id }).expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  await request(app).post('/api/orders').set('Cookie', global.signup()).send({ ticketId: ticket.id }).expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
