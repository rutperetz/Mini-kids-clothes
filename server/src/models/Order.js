import mongoose from 'mongoose';

// פריט אחד בתוך הזמנה
const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',      // קישור לטבלת המוצרים
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false } // לא צריך _id לכל פריט בנפרד
);

// הזמנה שלמה
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',         // מי ביצע את ההזמנה
      required: true,
    },
    items: {
      type: [OrderItemSchema], // מערך של פריטים
      required: true,
      validate: (v) => v.length > 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true } // יוצר createdAt / updatedAt
);

export const Order = mongoose.model('Order', OrderSchema);
