var express = require("express");
var router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  actionDeleteAll,
} = require("./controller");

const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", actionCreate);
router.delete("/delete", actionDeleteAll);

module.exports = router;
