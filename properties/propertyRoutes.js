const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
    getProperties,
    getPropertyDetail,
    getMyListings,
    getFavourites,
    createProperty,
    updateProperty,
    deleteProperty,
} = require("./propertyController");

router.route("/get").post(getProperties);
router.route("/propertydetail/:id").post(getPropertyDetail);
router.route("/mylistings").post(protect, getMyListings);
router.route("/favourites").post(protect, getFavourites);
router.route("/create").post(protect, createProperty);
router
    .route("/:id")
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;
