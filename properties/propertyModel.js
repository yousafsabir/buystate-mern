const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "please add title"],
            unique: false,
        },
        location: {
            type: String,
            required: [true, "please add location"],
            unique: false,
        },
        description: {
            type: String,
            required: [true, "please add description"],
            unique: false,
        },
        status: {
            type: String,
            required: [true, "please add status"],
            unique: false,
        },
        type: {
            type: String,
            required: [true, "please add type"],
            unique: false,
        },
        area: {
            type: Number,
            required: [true, "please add area"],
            unique: false,
        },
        beds: {
            type: Number,
            required: [true, "please add beds"],
            unique: false,
        },
        baths: {
            type: Number,
            required: [true, "please add baths"],
            unique: false,
        },
        garages: {
            type: Number,
            required: [true, "please add garages"],
            unique: false,
        },
        price: {
            type: Number,
            required: [true, "please add your price"],
            unique: false,
        },
        image: {
            type: String,
            required: [true, "please add your image"],
            unique: false,
        },
        imageId: {
            type: String,
            required: [true, "please add your image"],
            unique: false,
        },
        userId: {
            type: String,
            required: [true, "please add your image"],
            unique: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Property", propertySchema, "properties");
