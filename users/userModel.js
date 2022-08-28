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
        userName: {
            type: String,
            required: [true, "please add username"],
        },
        phone: {
            type: String,
            required: [true, "please add phone"],
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema, "users");
