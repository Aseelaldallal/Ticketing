import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper'; // setup.ts will replace this with fake nats wrapper
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data object
  const eventData = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'Concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore - we don't want to create mock implementation for each function
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, eventData, msg };
};

it.only('creates and saves a ticket', async () => {
  const { listener, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  const ticket = await Ticket.findById(eventData.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(eventData.title);
  expect(ticket!.price).toEqual(eventData.price);
});

it('acks the message', async () => {
  const { listener, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled();
});
