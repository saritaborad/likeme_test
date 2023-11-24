const Image = require("../models/Image");
const Video = require("../models/Video");
const User = require("../models/User");
const Agent = require("../models/Agent");
const Country = require("../models/Country");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");
const fs = require("fs");
const path = require("path");
const { deleteFile } = require("../utils/commonFunc");

exports.fetchHostApplications = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(User.find({ is_block: 0, is_host: 1 }).populate({ path: "images", select: "image -_id -user_id" }).select("_id fullName age identity profileimages").lean(), req.body?.options).search().sort().pagination();
 const hostApp = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments({ is_block: 0, is_host: 1 });
 return giveresponse(res, 200, true, "Host application get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, hostApp });
});

exports.RejectHost = asyncHandler(async (req, res, next) => {
 const images_all = await Image.find({ user_id: req.body._id }).lean();
 const videos_all = await Video.find({ user_id: req.body._id }).lean();

 for (const image of images_all) {
  deleteFile(image.image, "images/");
  await Image.findByIdAndDelete({ _id: image._id }).lean();
 }

 for (const video of videos_all) {
  deleteFile(video.video, "videos/");
  deleteFile(video.thumbnail_image, "images/");
  await Video.findByIdAndDelete({ _id: video._id }).lean();
 }

 const result = await User.updateOne({ _id: req.body._id }, { $set: { diamond_per_min: null, intrests: null, availabiltyHours: null, bio: null, about: null, age: null, is_host: 0, billingAddress: null } });
 if (result) return giveresponse(res, 200, true, "Host rejected successfully.");
});

exports.viewHost = asyncHandler(async (req, res, next) => {
 const all_agents = await Agent.find().lean();
 const countries = await Country.find().lean();
 const host = await User.findOne({ _id: req.body._id }).select("fullName availabiltyHours diamond_per_min email about billingAddress bio age intrests").lean();
 return giveresponse(res, 200, true, "view host success.", { host, countries, all_agents });
});

exports.requestUserById = asyncHandler(async (req, res, next) => {
 const user = await User.findById({ _id: req.body._id }).lean();
 return giveresponse(res, 200, true, "User get success.", user);
});
