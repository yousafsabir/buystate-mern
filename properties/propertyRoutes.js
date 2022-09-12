const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
    getProperties,
    getMyListings,
    createProperty,
    updateProperty,
    deleteProperty,
} = require("./propertyController");

router.route("/get").post(getProperties);
router.route("/mylistings").post(protect, getMyListings);
router.route("/create").post(protect, createProperty);
router
    .route("/:id")
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;
