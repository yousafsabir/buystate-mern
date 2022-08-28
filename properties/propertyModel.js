const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "please add title"],
        },
        location: {
            type: String,
            required: [true, "please add location"],
        },
        type: {
            type: String,
            required: [true, "please add type"],
        },
        size: {
            type: String,
            required: [true, "please add size"],
        },
        finishType: {
            type: String,
            required: [true, "please add finish Type"],
            unique: true,
        },
        imgUrl: {
            type: String,
            required: [true, "please add your image"],
            unique: true,
        },
        price: {
            type: String,
            required: [true, "please add your price"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Property", propertySchema, "properties");
