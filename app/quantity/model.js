const mongoose = require("mongoose");

let quantitySchema = mongoose.Schema(
  {
    quantityProduct: {
      type: Number,
      default: 0,
    },
    quantityName: {
      type: String,
      require: [true, "Masukkan nama product"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quantity", quantitySchema);
