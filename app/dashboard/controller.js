const Item = require("../item/model");
const Category = require("../category/model");
const Sale = require("../sale/model");
const User = require("../users/model");

module.exports = {
  index: async (req, res) => {
    try {
      const item = await Item.countDocuments();
      const category = await Category.countDocuments();
      const sale = await Sale.countDocuments();
      const user = await User.countDocuments();
      res.render("admin/dashboard/view_dashboard", {
        name: req.session.user.name,
        title: "Halaman Dashboard",
        count: {
          item,
          category,
          sale,
          user,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};
