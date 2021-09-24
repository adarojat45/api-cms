const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");

router.post("/", CategoryController.create);
router.get("/", CategoryController.findAll);
router.put("/:id", CategoryController.update);

module.exports = router;
