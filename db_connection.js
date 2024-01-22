const mongoose = require("mongoose");
require('dotenv').config({ path: 'sample.env' });
const dbURI = process.env.DB;

if (!dbURI) {
    console.error("Please provide a valid MongoDB URI in the environment variable DB.");
    process.exit(1);
}

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const db = mongoose.connect(dbURI, options)
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

module.exports = db;
