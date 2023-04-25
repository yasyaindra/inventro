var express = require("express");
var router = express.Router();
const {
  index,
  viewCreate,
  viewEdit,
  actionCreate,
  actionAccept,
  actionDecline,
} = require("./controller");

const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);

router.get("/", index);
router.get("/create", viewCreate);
router.get("/edit/:id", viewEdit);
router.post("/create", actionCreate);
router.put("/accept/:id", actionAccept);
router.delete("/delete/:id", actionDecline);

module.exports = router;
