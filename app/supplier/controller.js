const Supplier = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const supplier = await Supplier.find();

      console.log("alert >>");
      console.log(alert);

      res.render("admin/supplier/view_supplier", {
        supplier,
        alert,
        name: req.session.user.name,
        title: "Halaman supplier",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/supplier");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/supplier/create", {
        name: req.session.user.name,
        title: "Halaman tambah supplier",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/supplier");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, email } = req.body;

      console.log(">>> req.body");
      console.log(req.body);

      let supplier = await Supplier({ name, email });
      await supplier.save();

      req.flash("alertMessage", "Berhasil tambah supplier");
      req.flash("alertStatus", "success");

      res.redirect("/supplier");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/supplier");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const Supplier = await Supplier.findOne({ _id: id });

      res.render("admin/supplier/edit", {
        category,
        name: req.session.user.name,
        title: "Halaman ubah supplier",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/supplier");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await Supplier.findOneAndUpdate(
        {
          _id: id,
        },
        { name }
      );

      req.flash("alertMessage", "Berhasil ubah supplier");
      req.flash("alertStatus", "success");

      res.redirect("/supplier");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/supplier");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Supplier.findOneAndRemove({
        _id: id,
      });

      req.flash("alertMessage", "Berhasil hapus kategori");
      req.flash("alertStatus", "success");

      res.redirect("/supplier");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/supplier");
    }
  },
};
