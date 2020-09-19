import { Publisher, Subjects, TicketUpdatedEvent } from '@gettix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
