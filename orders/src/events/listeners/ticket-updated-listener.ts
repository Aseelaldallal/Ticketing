import { Listener, Subjects, TicketUpdatedEvent } from '@gettix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // console.log('DATA', data);
    // const ticket1 = await Ticket.findById(data.id);
    // console.log('Ticket1', ticket1);
    // const ticket2 = await Ticket.findOne({
    //   version: data.version - 1,
    // });
    // console.log('Ticket2', ticket2);
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    console.log('My ticket', ticket);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
