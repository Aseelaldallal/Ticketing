import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  // Create ticket
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();
  const user = global.signup();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
  expect(order.id).toEqual(fetchedOrder.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();
  const user = global.signup();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app).get(`/api/orders/${order.id}`).set('Cookie', global.signup()).send().expect(401);
});
