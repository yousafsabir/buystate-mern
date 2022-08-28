const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // need to allow from everywhere on atlas network access
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`db connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        // exiting the process
        process.exit(1);
    }
};

module.exports = connectDB;
