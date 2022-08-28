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
    const { fName, lName, userName, phone, email, password } = req.body;
    // Check if we have all the values
    if (!fName || !lName || !userName || !phone || !email || !password) {
        res.status(400).json({
            message: "please include all fields",
        });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({
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
        userName,
        phone,
        email,
        password: hashedPass,
    });
    if (user) {
        return res.status(201).json({
            message: "user registered successfully",
            user: {
                _id: user.id,
                fName: user.fName,
                lName: user.lName,
                userName: user.userName,
                phone: user.phone,
                email: user.email,
                token: generateToken(user.id),
            },
        });
    } else {
        res.status(400).json({
            message: "Invalid user data",
        });
    }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { idType, userId, password } = req.body;
    if (!idType || !userId || !password) {
        res.status(400).json({
            message: "please include all fields",
        });
    }
    // checking whether userId is phone, username or email
    let search = {};
    if (idType === "userName") {
        search = { userName: userId };
    } else if (idType === "phone") {
        search = { phone: userId };
    } else if (idType === "email") {
        search = { email: userId };
    }

    const user = await User.findOne(search);
    if (!user) {
        res.status(400).json({
            message: "User doesn't exist",
        });
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (passMatch) {
        res.status(200).json({
            message: "user logged in",
            user: {
                _id: user.id,
                fName: user.fName,
                lName: user.lName,
                userName: user.userName,
                phone: user.phone,
                email: user.email,
                token: generateToken(user.id),
            },
        });
    } else {
        res.status(400).json({
            message: "wrong password",
        });
    }
});

// @desc    Get user data
// @route   Get /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.json({
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
