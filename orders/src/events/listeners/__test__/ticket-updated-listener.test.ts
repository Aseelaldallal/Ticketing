import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper'; // setup.ts will replace this with fake nats wrapper
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  // create a fake data object
  const eventData = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'Quack',
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore - we don't want to create mock implementation for each function
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, eventData, msg };
};

it.only('finds, updates and saves a ticket', async () => {
  const { listener, ticket, eventData, msg } = await setup();
  const tickets = await Ticket.find();
  await listener.onMessage(eventData, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(eventData.title);
  expect(updatedTicket!.price).toEqual(eventData.price);
  expect(updatedTicket!.version).toEqual(eventData.version);
});

it('acks the message', async () => {
  const { listener, ticket, eventData, msg } = await setup();
  await listener.onMessage(eventData, msg);
  expect(msg.ack).toHaveBeenCalled;
});
