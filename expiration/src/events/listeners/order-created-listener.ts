import { Listener } from '@gettix/common/build/events/base-listener';
import { OrderCreatedEvent } from '@gettix/common/build/events/types/order-created-event';
import { Subjects } from '@gettix/common/build/events/types/subjects';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    });
    msg.ack();
  }
}
