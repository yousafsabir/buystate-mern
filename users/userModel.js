const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        fName: {
            type: String,
            required: [true, "please add your first name"],
        },
        lName: {
            type: String,
            required: [true, "please add your last name"],
        },
        image: {
            type: String,
            required: [false, "not required by default"],
        },
        imageId: {
            type: String,
            required: [false, "not required by default"],
        },
        userName: {
            type: String,
            required: [true, "please add username"],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "please add phone"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "please add your email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "please add your password"],
        },
        favourites: {
            type: Array,
            required: [false, "not required by default"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema, "users");
