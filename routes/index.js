const router = require("express").Router();

const category = require("./categoryRoute");

router.use("/categories", category);

module.exports = router;
