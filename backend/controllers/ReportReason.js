const ReportReson = require("../models/ReportReason");
const ApiFeatures = require("../utils/ApiFeatures");
const { asyncHandler, giveresponse } = require("../utils/res_help");

exports.fetchAllReportReson = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(ReportReson.find().lean(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await ReportReson.countDocuments();
 return giveresponse(res, 200, true, "Report reason get success", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data });
});

exports.addReportReson = asyncHandler(async (req, res, next) => {
 const newReportReson = new ReportReson({ title: req.body.title });
 await newReportReson.save();
 return giveresponse(res, 200, true, "ReportReson added successfully");
});

exports.updateReportReson = asyncHandler(async (req, res, next) => {
 const result = await ReportReson.updateOne({ _id: req.body._id }, { $set: { title: req.body.title } });

 if (result) {
  return giveresponse(res, 200, true, "Data updated successfully!");
 } else {
  return giveresponse(res, 400, false, "Something went wrong!");
 }
});

exports.deleteReportReson = asyncHandler(async (req, res, next) => {
 const result = await ReportReson.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Data deleted successfully!");
});

//-----------android api route -------

exports.reportReson = asyncHandler(async (req, res, next) => {
 let data = await ReportReson.find().select("title").lean();
 if (data.length == 0) return giveresponse(res, 404, false, "Data not found");
 data = data.map((item) => item.title);
 return giveresponse(res, 200, true, "Data fetch successfully", data);
});
