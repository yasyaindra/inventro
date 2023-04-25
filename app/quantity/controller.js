const Quantity = require("./model");
const Product = require("../item/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const quantity = await Quantity.find();

      res.render("admin/quantity/view_quantity", {
        quantity,
        alert,
        name: req.session.user.name,
        title: "Halaman quantity",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/quantity");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const products = await Product.find();
      res.render("admin/quantity/create", {
        products,
        name: req.session.user.name,
        title: "Halaman tambah quantity",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/quantity");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { quantityName, quantityProduct } = req.body;

      let quantity = await Quantity({ quantityName, quantityProduct });
      await quantity.save();

      req.flash("alertMessage", "Berhasil tambah quantity");
      req.flash("alertStatus", "success");

      res.redirect("/quantity");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/quantity");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const products = await Product.find();
      const quantity = await Quantity.findOne({ _id: id });

      // console.log("product >>>", product);

      res.render("admin/quantity/edit", {
        products,
        quantity,
        name: req.session.user.name,
        title: "Create Quantity Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/quantity");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantityName, quantityProduct } = req.body;

      await Quantity.findOneAndUpdate(
        {
          _id: id,
        },
        { quantityName, quantityProduct }
      );

      req.flash("alertMessage", "Berhasil ubah quantity");
      req.flash("alertStatus", "success");

      res.redirect("/quantity");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/quantity");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Quantity.findOneAndRemove({
        _id: id,
      });

      req.flash("alertMessage", "Berhasil hapus quantity");
      req.flash("alertStatus", "success");

      res.redirect("/quantity");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/quantity");
    }
  },
};
