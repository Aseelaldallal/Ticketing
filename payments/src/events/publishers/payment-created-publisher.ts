import { PaymentCreatedEvent, Publisher, Subjects } from '@gettix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
