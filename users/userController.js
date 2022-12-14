const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./userModel");
const empty = require("is-empty");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // destructuring
    const { fName, lName, userName, phone, email, password, image, imageId } =
        req.body;
    // Check if we have all the values
    if (!fName || !lName || !userName || !phone || !email || !password) {
        return res.status(400).json({
            message: "please include all fields",
        });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            message: "user Already exists",
        });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        fName,
        lName,
        image,
        imageId,
        userName,
        phone,
        email,
        password: hashedPass,
    });
    if (user) {
        return res.status(200).json({
            status: 201,
            message: "user registered successfully",
            user: {
                _id: user.id,
                image: user.image,
                imageId: user.imageId,
                fName: user.fName,
                lName: user.lName,
                userName: user.userName,
                phone: user.phone,
                email: user.email,
                token: generateToken(user.id),
            },
        });
    } else {
        return res.status(400).json({
            message: "Invalid user data",
        });
    }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { id, password } = req.body;
    if (empty(id) || empty(password)) {
        return res.status(400).json({
            message: "please include all fields",
        });
    }
    let toFind;

    if (/@/g.test(id)) {
        // if it contains @
        toFind = {
            email: id,
        };
    } else if (/^\d+$/g.test(id)) {
        // if it only contains digits
        toFind = {
            phone: id,
        };
    } else {
        toFind = {
            userName: id,
        };
    }

    const user = await User.findOne(toFind).select(
        "-favourites -createdAt -updatedAt"
    );
    if (!user) {
        return res.status(200).json({
            status: 400,
            message: "User doesn't Exist",
        });
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (passMatch) {
        return res.status(200).json({
            status: 200,
            message: "user logged in",
            user: {
                _id: user.id,
                image: user.image,
                imageId: user.imageId,
                fName: user.fName,
                lName: user.lName,
                userName: user.userName,
                phone: user.phone,
                email: user.email,
                token: generateToken(user.id),
            },
        });
    } else {
        return res.status(200).json({
            status: 400,
            message: "wrong password",
        });
    }
});

// @desc    Get user data
// @route   Get /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    return res.json({
        status: 200,
        message: "user data sent successfully",
        user: req.user,
    });
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
