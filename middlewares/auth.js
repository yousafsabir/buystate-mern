const jwt = require("jsonwebtoken");
const User = require("../users/userModel");

const protect = async (req, res, next) => {
    // This authorization is with bearer token

    try {
        let key = req.headers.authorization;
        if (!key) {
            res.status(401).json({
                message: "not authorized, no token",
            });
        }
        // extracting token from key
        let token = key.split(" ")[1];
        // verfying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({
                message: "not authorized",
            });
        }
        // Also sending user data (not the password) with the request
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log("auth error", error);
        res.status(401).json({
            message: "not authorized",
        });
    }
};

module.exports = { protect };
