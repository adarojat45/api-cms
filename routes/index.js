const router = require("express").Router();

const category = require("./categoryRoute");
const post = require("./postRoute");
const user = require("./userRoute");

router.use("/categories", category);
router.use("/posts", post);
router.use("/users", user);

module.exports = router;
