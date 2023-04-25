const mongoose = require("mongoose");

let saleSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    quantity: {
      type: Number,
      require: [true, "quantity must be filled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
