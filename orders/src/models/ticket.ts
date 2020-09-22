import mongoose from 'mongoose';

// An interface that describes the properties that
// are required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An inteface that describes the properties that a Ticket
// Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
}
ß;
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

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export { Ticket };
