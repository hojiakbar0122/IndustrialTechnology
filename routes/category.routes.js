const { addNewCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require("../controllers/category.controller")
const isAdmin = require("../middleware/guards/isAdmin.guard")
const verifyToken = require("../middleware/guards/verifyToken.guard")

const router = require("express").Router()

router.post("/", verifyToken, isAdmin, addNewCategory)
router.get("/", getAllCategories)
router.get("/:id", getCategoryById)
router.put("/:id", verifyToken, isAdmin, updateCategoryById)
router.delete("/:id", verifyToken, isAdmin, deleteCategoryById)

module.exports = router