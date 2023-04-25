const Order = require("./model");
const Sale = require("../sale/model");
const Quantity = require("../quantity/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      console.log("alert >>");
      console.log(alert);

      const orders = await Order.find().populate("quantityProducts");

      res.render("admin/order/view_order", {
        alert,
        orders,
        name: req.session.user.name,
        title: "Order Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/order");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const quantityProducts = await Quantity.find();
      res.render("admin/order/create", {
        quantityProducts,
        name: req.session.user.name,
        title: "Create Order Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/order");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, quantityProducts } = req.body;

      console.log(">>> req.body");
      console.log(req.body);

      let order = await Order({ name, quantityProducts });
      await order.save();

      req.flash("alertMessage", "Berhasil tambah kategori");
      req.flash("alertStatus", "success");

      res.redirect("/order");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/order");
    }
  },
  actionAccept: async (req, res) => {
    try {
      const { id } = req.params;

      const { quantity } = req.body;

      console.log(req.body);

      await Order.findOneAndUpdate(
        {
          _id: id,
        },
        {
          quantity,
        }
      );

      req.flash("alertMessage", "Berhasil ubah order");
      req.flash("alertStatus", "success");

      res.redirect("/order");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/order");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.body;
      const order = await Order.find({ id }).populate("quantityProducts");

      const allQty = await Quantity.find();
      const quantity = order[0].quantityProducts;

      const qtyProduct = quantity.map((obj) => {
        return {
          quantityProduct: obj.quantityProduct,
          _id: obj._id,
          quantityName: obj.quantityName,
        };
      });

      function getProductInfo(array1, array2) {
        return array1.map((product1) => {
          const product2 = array2.find(
            (product2) => product2._id === product1._id.toString()
          );
          return {
            quantityName: product1.quantityName,
            quantity: product1.quantityProduct,
            _id: product1._id,
            selected: !!product2,
          };
        });
      }

      console.log("all qty", allQty);
      // console.log("quantity", quantity);
      console.log("qtyProduct", qtyProduct);

      const qty = getProductInfo(allQty, qtyProduct);

      console.log(qty);

      res.render("admin/order/edit", {
        order: order,
        qty,
        name: req.session.user.name,
        title: "Edit Order Page",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/order");
    }
  },
  actionDecline: async (req, res) => {
    try {
      const { id } = req.params;

      await Order.remove({ _id: id });

      await Sale.remove({ order: id });

      req.flash("alertMessage", "Berhasil hapus sale");
      req.flash("alertStatus", "success");

      res.redirect("/sale");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/order");
    }
  },
};
