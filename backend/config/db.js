const mongoose = require("mongoose");
require("dotenv").config();

const URI = process.env.PRODUCTION == 1 ? process.env.LIVEURI : process.env.MONGO_URI;

const connectDB = async () => {
 await mongoose
  .connect(URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   family: 4,
  })
  .then(() => {
   console.log("Mongodb Connected");
  });
};

module.exports = { connectDB };
