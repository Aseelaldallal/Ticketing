import { Publisher } from '@gettix/common/build/events/base-publisher';
import { ExpirationCompleteEvent } from '@gettix/common/build/events/types/expiration-complete-event';
import { Subjects } from '@gettix/common/build/events/types/subjects';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
