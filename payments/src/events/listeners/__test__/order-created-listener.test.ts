import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { OrderStatus } from '@gettix/common';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const eventData = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, eventData, msg };
};

it('replicates the order info', async () => {
  const { listener, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  const order = await Order.findById(eventData.id);
  expect(order!.price).toEqual(eventData.ticket.price);
});

it('acks the message', async () => {
  const { listener, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled();
});
