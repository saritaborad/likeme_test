const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
 {
  country_name: { type: String },
  position: { type: Number },
  id: { type: String },
 },
 {
  timestamps: true,
 }
);

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
