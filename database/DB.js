const mongoose = require('mongoose');

const connectDB = (URL)=>{
    console.log("Database Connected");
    return mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectDB;

