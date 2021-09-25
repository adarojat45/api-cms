const router = require("express").Router();

const category = require("./categoryRoute");
const post = require("./postRoute");

router.use("/categories", category);
router.use("/posts", post);

module.exports = router;
