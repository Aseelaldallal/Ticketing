import { Publisher, OrderCancelledEvent, Subjects } from '@gettix/common';

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
