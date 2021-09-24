const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");

router.post("/", CategoryController.create);
router.get("/", CategoryController.findAll);

module.exports = router;
