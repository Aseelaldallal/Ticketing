import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './orders';

// An interface that describes the properties that
// are required to create a new Ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// An inteface that describes the properties that a Ticket
// Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved: () => Promise<boolean>;
}

// An interface that describes the properties that the
// Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    ...attrs,
  });
};

// Make sure Ticket not reserved. Run query to look at all orders. Find an order where
// the ticket is the ticket we just found *and* the orders status is *not* cancelled.
// If we find an order from that, it means the ticket is reserved
TicketSchema.methods.isReserved = async function () {
  // this == the ticket document that we just called 'isReserved' on
  // we use function keyword because arrow function will mess around value of this
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export { Ticket };
