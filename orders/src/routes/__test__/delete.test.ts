import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  // make a request to create order
  const user = global.signup();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to cancel order
  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).expect(204);
  // expect order to be cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  // make a request to create order
  const user = global.signup();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to cancel order
  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
