import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { OrderStatus } from '@gettix/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();
  const eventData = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, order, eventData, msg };
};

it('updates the status of the order', async () => {
  const { listener, order, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, order, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled();
});
