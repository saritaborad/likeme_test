const mongoose = require("mongoose");

const paymentGetwaySchema = new mongoose.Schema(
 {
  payment_getway: {
   type: String,
   required: true,
  },
 },
 {
  timestamps: true,
 }
);

const PaymentGetway = mongoose.model("PaymentGetway", paymentGetwaySchema);

module.exports = PaymentGetway;
