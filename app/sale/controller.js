const Sale = require("./model");
const Order = require("../order/model");
const Item = require("../item/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      console.log("alert >>");
      console.log(alert);

      const sales = await Sale.find().populate({
        path: "order",
        populate: {
          path: "quantityProducts",
        },
      });

      res.render("admin/sale/view_sale", {
        alert,
        sales,
        name: req.session.user.name,
        title: "Sale Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/sale");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const product = await Item.find();
      res.render("admin/sale/create", {
        product,
        name: req.session.user.name,
        title: "Create Sale Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/sale");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { order, quantity, quantityName, productQty } = req.body;

      const sale = await Sale({ order, quantity });
      function toArray(input) {
        return Array.isArray(input)
          ? input
          : typeof input === "number" || typeof input === "string"
          ? [input]
          : [];
      }

      let qty = toArray(productQty);
      let qtyName = toArray(quantityName);

      let multiplied = qty.map((x) => x * quantity);

      for (let i = 0; i < qtyName.length; i++) {
        const filter = { name: qtyName[i] };
        const update = { $inc: { quantity: -multiplied[i] } };

        await Item.updateMany(filter, update);
      }

      await sale.save();
      req.flash("alertMessage", "Berhasil tambah sale");
      req.flash("alertStatus", "success");

      res.redirect("/sale");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/sale");
    }
  },
  actionDeleteAll: async (req, res) => {
    try {
      await Sale.remove({});
      req.flash("alertMessage", "Berhasil tambah sale");
      req.flash("alertStatus", "success");

      res.redirect("/sale");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/sale");
    }
  },
};
