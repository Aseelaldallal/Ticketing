import mongoose from 'mongoose';

// An interface that describes the properties that
// are required to create a new Payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// An inteface that describes the properties that a Payment
// Document has
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

// An interface that describes the properties that the
// Payment model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
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

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentSchema);

export { Payment };
