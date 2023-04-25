const mongoose = require("mongoose");

let orderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name must be filled"],
    },
    quantityProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quantity",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
