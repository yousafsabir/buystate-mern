const asyncHandler = require("express-async-handler");
const Property = require("./propertyModel");

const getProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find();

    res.status(200).json({
        status: 200,
        message: `successfully fetched properties`,
        properties,
    });
});
const createProperty = asyncHandler(async (req, res) => {
    const { title, location, type, size, finishType, imgUrl, price } = req.body;

    if (
        !title ||
        !location ||
        !type ||
        !size ||
        !finishType ||
        !imgUrl ||
        !price
    ) {
        res.status(400).json({
            message: "please include all fields",
        });
    }

    const property = await Property.create(req.body);
    if (property) {
        res.status(201).json({
            status: 201,
            message: "property created successfully",
        });
    }
});
const updateProperty = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            message: "id not found",
        });
    }
    const updatedOne = await Property.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    res.json({
        status: 200,
        message: "successfully updated",
        updatedOne,
    });
});
const deleteProperty = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            message: "id not found",
        });
    }
    const deletedOne = await Property.findByIdAndDelete(id);
    res.json({
        message: "successfully deleted",
        status: 200,
        deletedOne,
    });
});

module.exports = {
    getProperties,
    createProperty,
    updateProperty,
    deleteProperty,
};
