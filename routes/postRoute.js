const router = require("express").Router();
const PostController = require("../controllers/postController");

router.post("/", PostController.create);
router.get("/", PostController.findAll);
router.put("/:id", PostController.update);
router.delete("/:id", PostController.delete);
router.patch("/:id/updateStatus", PostController.updateStatus);

module.exports = router;
