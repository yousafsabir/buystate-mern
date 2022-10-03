const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
    getProperties,
    getPropertyDetail,
    getMyListings,
    getFavourites,
    getFavouriteProperties,
    createProperty,
    updateProperty,
    suspendOrResumeProperty,
    setSuspend,
    deleteProperty,
} = require("./propertyController");

router.route("/get").post(getProperties);
router.route("/propertydetail/:id").post(getPropertyDetail);
router.route("/mylistings").post(protect, getMyListings);
router.route("/favourites").post(protect, getFavourites);
router.route("/favouriteproperties").post(protect, getFavouriteProperties);
router.route("/create").post(protect, createProperty);
// router.route("/suspendorresume").post(protect, suspendOrResumeProperty);
router.route("/suspendorresume").post(protect, setSuspend);
router
    .route("/:id")
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;
