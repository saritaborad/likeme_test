const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");
const Agent = require("../models/Agent");
const fs = require("fs");
const path = require("path");
const { deleteFile } = require("../utils/commonFunc");

exports.fetchAllagent = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Agent.find().populate({ path: "contry", select: "country_name _id" }).lean(), req.body?.options).search().sort().pagination();
 const agents = await apiFeature.query;
 apiFeature.totalRecord = await Agent.countDocuments();
 return giveresponse(res, 200, true, "Agent list get success", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, agents });
});

exports.addAgent = asyncHandler(async (req, res) => {
 const { name, email_id, password, phone_no, contry, status, coins, coins_rate, stream_minits, stream_rate, images } = req.body;
 const agent = new Agent({ name, email_id, password, phone_no, contry, status, images: images, coins, coins_rate, stream_minits, stream_rate });
 await agent.save();
 return giveresponse(res, 200, true, "Agent added successfully");
});

exports.editAgent = asyncHandler(async (req, res) => {
 const { name, email_id, password, phone_no, contry, status, _id, images } = req.body;
 const agentsData = await Agent.findOne({ _id });
 if (!images) {
  await agentsData.updateOne({ name, email_id, password, phone_no, contry, status });
 } else {
  deleteFile(agentsData.images, "images/");
  await agentsData.updateOne({ name, email_id, password, phone_no, contry, status, images: images });
 }
 return giveresponse(res, 200, true, "Agent updated successfully");
});

exports.deleteAgent = asyncHandler(async (req, res) => {
 const { _id } = req.body;
 const agent = await Agent.findOne({ _id });
 if (!agent) return giveresponse(res, 404, false, "Agent not found");
 deleteFile(agent.images, "images/");
 const result = await agent.deleteOne({ _id });
 if (result) return giveresponse(res, 200, true, "Successfully deleted");
});

exports.fetchAgents = asyncHandler(async (req, res, next) => {
 const agents = await Agent.find({ is_deleted: 0 }).sort({ _id: -1 }).select("name _id").lean();
 return giveresponse(res, 200, true, "Agent data get success.", agents);
});

exports.fetchAgentById = asyncHandler(async (req, res, next) => {
 const agent = await Agent.findOne({ _id: req.body?._id }).lean();
 return giveresponse(res, 200, true, "Agent data get success.", agent);
});
