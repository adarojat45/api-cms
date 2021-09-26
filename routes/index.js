const router = require("express").Router();

const Auth = require("../middlewares/auth");
const errorHandler = require("../middlewares/errorHandler");
const category = require("./categoryRoute");
const post = require("./postRoute");
const user = require("./userRoute");

router.use("/users", user);

router.use(Auth.authentication);
router.use("/categories", category);
router.use("/posts", post);

router.use(errorHandler);

module.exports = router;
