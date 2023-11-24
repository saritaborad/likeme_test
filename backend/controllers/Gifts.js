const { giveresponse, asyncHandler } = require("../utils/res_help");
const Gifts = require("../models/Gift");
const ApiFeatures = require("../utils/ApiFeatures");
const path = require("path");
const fs = require("fs");
const { deleteFile } = require("../utils/commonFunc");

exports.fetchAllgifts = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Gifts.find().lean(), req.body?.options).search().sort().pagination();
 const gifts = await apiFeature.query;
 apiFeature.totalRecord = await Gifts.countDocuments();
 return giveresponse(res, 200, true, "All gifts get successfully.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, gifts });
});

exports.addGifts = asyncHandler(async (req, res, next) => {
 const gift = new Gifts({ diamond: req.body.diamond, images: req.file.filename });
 const result = await gift.save();
 if (!result) return giveresponse(res, 400, false, "Failed to add image");
 return giveresponse(res, 200, true, "Successfully added image (only png)");
});

exports.editGift = asyncHandler(async (req, res, next) => {
 const { _id, diamond, images } = req.body;
 let updateData = { diamond };
 if (images || req.file?.path) {
  const unlinkData = await Gifts.findById(_id).lean();
  if (unlinkData.images) deleteFile(unlinkData.images, "images/");
  updateData.images = images || req.file?.filename;
 }
 const result = await Gifts.updateOne({ _id }, updateData);
 if (result) return giveresponse(res, 200, true, "Successfully updated");
});

exports.deleteGift = asyncHandler(async (req, res, next) => {
 const gift_data = await Gifts.findById({ _id: req.body._id });
 deleteFile(gift_data.images, "images/");
 const result = await gift_data.deleteOne();
 if (result) return giveresponse(res, 200, true, "Successfully deleted");
});

exports.giftList = asyncHandler(async (req, res, next) => {
 const result = await Gifts.find().sort({ _id: -1 }).select("-updatedAt -createdAt -__v").lean();
 return giveresponse(res, 200, true, "gift list get successfully", result);
});
