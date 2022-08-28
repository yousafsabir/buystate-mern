const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/error");

const port = process.env.PORT;

// running database
connectDB();

const app = express();

app.use(cors());

// To parse req.body
app.use(express.json());
// To parse urlencoded
app.use(express.urlencoded({ extended: false }));

const userRoutes = require("./users/userRoutes");
const propertyRoutes = require("./properties/propertyRoutes");

app.use("/api/users/", userRoutes);
app.use("/api/properties/", propertyRoutes);

app.use(errorHandler);

// to serve frontend
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/build")));

    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "./", "client", "build", "index.html")
        );
    });
} else {
    app.get("/", (req, res) => {
        res.send("Please set to production");
    });
}

app.listen(port, () => console.log("App Started on port:", port));
