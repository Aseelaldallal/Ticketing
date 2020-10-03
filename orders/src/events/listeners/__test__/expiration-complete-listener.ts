import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../../models/orders';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  const eventData = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, order, eventData, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const data = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled();
});
