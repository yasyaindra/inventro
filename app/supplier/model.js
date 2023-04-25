const mongoose = require("mongoose");

let supplierSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama kategori harus diiisi"],
    },
    email: {
      type: String,
      require: [true, "Nama kategori harus diiisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
