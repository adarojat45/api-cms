const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");

router.post("/", CategoryController.create);
router.get("/", CategoryController.findAll);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);
router.patch("/:id/updateStatus", CategoryController.updateStatus);

module.exports = router;
