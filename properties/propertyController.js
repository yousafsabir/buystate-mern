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
const deleteProperty = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            message: "id not found",
        });
    }
    const deletedOne = await Property.findByIdAndDelete(id);
    return res.json({
        message: "successfully deleted",
        status: 200,
        deletedOne,
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
    createProperty,
    updateProperty,
    deleteProperty,
};
