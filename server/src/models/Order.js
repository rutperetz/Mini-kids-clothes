import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number
      }
    ],

    totalPrice: { type: Number, required: true },
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
