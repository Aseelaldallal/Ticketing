import { Publisher, OrderCreatedEvent, Subjects } from '@gettix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
