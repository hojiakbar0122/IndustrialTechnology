const { addNewReview, getAllReviews, getReviewById, updateReviewById, deleteReviewById } = require("../controllers/review.controller");

const router = require("express").Router();

router.post("/", addNewReview);
router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.put("/:id", updateReviewById);
router.delete("/:id", deleteReviewById);

module.exports = router;
