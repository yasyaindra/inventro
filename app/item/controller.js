const Item = require("./model");
const Category = require("../category/model");
const Supplier = require("../supplier/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const item = await Item.find().populate("category").populate("supplier");

      res.render("admin/item/view_item", {
        item,
        alert,
        name: req.session.user.name,
        title: "Halaman item",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/item");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const supplier = await Supplier.find();

      res.render("admin/item/create", {
        category,
        supplier,
        name: req.session.user.name,
        title: "Halaman tambah item",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/item");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, category, supplier, quantity, article_number } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const item = new Item({
              name,
              category,
              supplier,
              quantity,
              article_number,
              thumbnial: filename,
            });

            await item.save();

            req.flash("alertMessage", "Berhasil tambah item");
            req.flash("alertStatus", "success");

            res.redirect("/item");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/item");
          }
        });
      } else {
        const item = new Item({
          name,
          category,
          nominals,
        });

        await item.save();

        req.flash("alertMessage", "Berhasil tambah item");
        req.flash("alertStatus", "success");

        res.redirect("/item");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const supplier = await Supplier.find();
      const item = await Item.findOne({ _id: id })
        .populate("category")
        .populate("supplier");

      res.render("admin/item/edit", {
        item,
        supplier,
        category,
        name: req.session.user.name,
        title: "Halaman ubah item",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/item");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, quantity, supplier } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const item = await Item.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${item.thumbnial}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Item.findOneAndUpdate(
              {
                _id: id,
              },
              {
                name,
                category,
                supplier,
                quantity,
                thumbnial: filename,
              }
            );

            req.flash("alertMessage", "Berhasil ubah item");
            req.flash("alertStatus", "success");

            res.redirect("/item");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/item");
          }
        });
      } else {
        await Item.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            category,
            supplier,
            quantity,
          }
        );

        req.flash("alertMessage", "Berhasil ubah item");
        req.flash("alertStatus", "success");

        res.redirect("/item");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/item");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const item = await Item.findOneAndRemove({
        _id: id,
      });

      let currentImage = `${config.rootPath}/public/uploads/${item.thumbnial}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash("alertMessage", "Berhasil hapus item");
      req.flash("alertStatus", "success");

      res.redirect("/item");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/item");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let item = await Item.findOne({ _id: id });

      let status = item.status === "Y" ? "N" : "Y";

      item = await Item.findOneAndUpdate(
        {
          _id: id,
        },
        { status }
      );

      req.flash("alertMessage", "Berhasil ubah status");
      req.flash("alertStatus", "success");

      res.redirect("/item");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/item");
    }
  },
};
