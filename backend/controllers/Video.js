const Video = require("../models/Video");
const VideoReview = require("../models/VideoReview");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");
const path = require("path");
const { deleteFile } = require("../utils/commonFunc");

exports.deleteVideoById = asyncHandler(async (req, res, next) => {
 const video = await Video.findById({ _id: req.body._id }).lean();
 if (video.video || video.thumbnail_image) {
  deleteFile(video.video, "videos/");
  deleteFile(video.thumbnail_image, "images/");
 }
 await Video.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Successfully deleted video");
});

exports.videoById = asyncHandler(async (req, res, next) => {
 const result = await Video.find({ user_id: req.body._id }).lean();
 return giveresponse(res, 200, true, "Video get success.", result);
});

exports.fetchHostVideos = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Video.find({ user_id: req.body._id }).lean(), req.body?.options).search().sort().pagination();
 const videos = await apiFeature.query;
 apiFeature.totalRecord = await Video.countDocuments({ user_id: req.body._id });
 return giveresponse(res, 200, true, "Video get successfully!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: videos });
});

exports.fetchAllVideoReview = asyncHandler(async (req, res, next) => {
 const videos = await VideoReview.find().sort({ _id: -1 }).lean();
 const total = videos.length;
 return giveresponse(res, 200, true, "video review get successfully", { videos, total });
});

exports.acceptVideoReview = asyncHandler(async (req, res, next) => {
 const video = await VideoReview.findOne({ _id: req.body._id }).lean();
 const vid = new Video({ video: video.video, thumbnail_image: video.thumbnail_image, user_id: video.user_id });
 await vid.save();
 await VideoReview.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Video accepted successfully");
});

exports.rejectVideoReview = asyncHandler(async (req, res, next) => {
 const video = await VideoReview.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Video rejected successfully");
});
