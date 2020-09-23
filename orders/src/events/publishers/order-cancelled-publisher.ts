import { Publisher, OrderCancelledEvent, Subjects } from '@gettix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
