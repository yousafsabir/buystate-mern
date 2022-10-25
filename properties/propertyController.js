const asyncHandler = require("express-async-handler");
const empty = require("is-empty");
const Property = require("./propertyModel");
const User = require("../users/userModel");

const getProperties = asyncHandler(async (req, res) => {
    let { find, sort, page, limit } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);

    const toSort = useSort(sort);

    const pagination = await usePagination(page, limit, find, Property);

    const properties = await Property.find(find)
        .sort(toSort)
        .skip(pagination.startIndex)
        .limit(limit);

    return res.status(200).json({
        status: 200,
        message: `successfully fetched properties`,
        pagination,
        properties,
    });
});

// @desc    Get Property Detail
// @route   Get /api/users/propertydetail/:id
// @access  public
const getPropertyDetail = asyncHandler(async (req, res) => {
    let { id } = req.params;

    if (empty(id)) {
        return res.status(200).json({
            status: 404,
            message: `Property Id not found`,
        });
    }

    const property = await Property.findById(id);

    const user = await User.findById(property?.userId);

    return res.status(200).json({
        status: 200,
        message: `successfully fetched property detail`,
        property,
        user,
    });
});

const getMyListings = asyncHandler(async (req, res) => {
    let { sort, page, limit } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const id = req.user._id;

    const toSort = useSort(sort);

    const pagination = await usePagination(page, limit, { _id: id }, Property);

    const properties = await Property.find({ userId: id })
        .sort(toSort)
        .skip(pagination.startIndex)
        .limit(limit);

    if (properties.length === 0) {
        return res.json({
            status: 404,
            message: "No Listings found for this user",
        });
    }
    return res.json({
        status: 200,
        user: req.user._id,
        pagination,
        properties,
    });
});

// multi function api
const getFavourites = asyncHandler(async (req, res) => {
    let { propertyId = null } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("favourites -_id");
    let favourites = user.favourites;

    // Returns if no id provided
    if (!propertyId) {
        return res.status(200).json({
            status: 200,
            message: "fetched favourites",
            favourites,
        });
    }

    if (!favourites.includes(propertyId)) {
        // To add
        favourites.push(propertyId);
        await User.findByIdAndUpdate(userId, {
            $push: { favourites: propertyId },
        });
        return res.status(200).json({
            status: 200,
            message: "Property added to Favourites",
            favourites,
        });
    } else {
        // To Remove
        let index = favourites.indexOf(propertyId);
        favourites.splice(index, 1);
        await User.findByIdAndUpdate(userId, {
            $pull: { favourites: propertyId },
        });
        return res.status(200).json({
            status: 200,
            message: "Property removed from Favourites",
            favourites,
        });
    }
});
const getFavouriteProperties = asyncHandler(async (req, res) => {
    let { sort, page, limit } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const userId = req.user._id;

    const doc = await User.findById(userId).select("favourites -_id");
    const list = doc.favourites;

    if (list.length === 0) {
        return res.status(200).json({
            status: 404,
            message: "You Don't have any favourites",
        });
    }

    // Sorting the properties
    if (sort === "ascending") {
        list.reverse();
    }

    // Custom Pagination for this api
    let pagination = {
        page,
        previous: null,
        next: null,
    };

    const startIndex = (page - 1) * limit;
    if (startIndex > 0) {
        pagination.previous = page - 1;
    }

    let endIndex = page * limit;
    if (endIndex > list.length - 1) {
        endIndex = list.length - 1;
    } else if (endIndex < list.length) {
        pagination.next = page + 1;
    }

    // initializing properties array
    let properties = [];

    // fetching properties according to pagination
    for (let i = startIndex; i <= endIndex; i++) {
        let property = await Property.findById(list[i]);
        properties.push(property);
    }

    return res.status(200).json({
        status: 200,
        message: "fetched favourite properties",
        properties,
        pagination,
    });
});
const createProperty = asyncHandler(async (req, res) => {
    const {
        title,
        location,
        description,
        status,
        type,
        area,
        beds,
        baths,
        garages,
        price,
        image,
        imageId,
        userId,
    } = req.body;

    if (
        !title ||
        !location ||
        !description ||
        !status ||
        !type ||
        !area ||
        !beds ||
        !baths ||
        !garages ||
        !price ||
        !image ||
        !imageId ||
        !userId
    ) {
        return res.status(400).json({
            message: "please include all fields",
        });
    }

    const property = await Property.create(req.body);
    if (property) {
        return res.status(201).json({
            status: 201,
            message: "property created successfully",
            property,
        });
    }
});
const updateProperty = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            message: "id not found",
        });
    }
    const updatedOne = await Property.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    return res.json({
        status: 200,
        message: "successfully updated",
        updatedOne,
    });
});
const setSuspend = asyncHandler(async (req, res) => {
    let { propertyId = null } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("suspends -_id");
    let suspends = user.suspends;

    // Returns if no id provided
    if (!propertyId) {
        return res.status(200).json({
            status: 200,
            message: "fetched suspends",
            suspends,
        });
    }

    if (!suspends.includes(propertyId)) {
        // To add
        suspends.push(propertyId);
        await User.findByIdAndUpdate(userId, {
            $push: { suspends: propertyId },
        });
        return res.status(200).json({
            status: 200,
            message: "Property suspended",
            suspends,
        });
    } else {
        // To Remove
        let index = suspends.indexOf(propertyId);
        suspends.splice(index, 1);
        await User.findByIdAndUpdate(userId, {
            $pull: { suspends: propertyId },
        });
        return res.status(200).json({
            status: 200,
            message: "Property resumed",
            suspends,
        });
    }
});
const deleteProperty = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(200).json({
            status: 400,
            message: "id not found",
        });
    }
    const deletedOne = await Property.findByIdAndDelete(id);
    return res.status(200).json({
        status: 200,
        message: "property successfully removed",
    });
});

// utilities
async function usePagination(page, limit, findQuery, model) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let pagination = {
        page,
        previous: null,
        next: null,
        startIndex,
        endIndex,
    };

    if (startIndex > 0) {
        pagination.previous = page - 1;
    }
    if (endIndex < (await model.find(findQuery).count())) {
        pagination.next = page + 1;
    }
    return pagination;
}

function useSort(toSort) {
    if (toSort === "ascending") {
        return { $natural: 1 };
    } else if (toSort === "descending") {
        return { $natural: -1 };
    } else {
        return null;
    }
}

module.exports = {
    getProperties,
    getPropertyDetail,
    getMyListings,
    getFavourites,
    getFavouriteProperties,
    createProperty,
    updateProperty,
    setSuspend,
    deleteProperty,
};
