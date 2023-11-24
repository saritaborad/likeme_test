const Messages = require("../models/Message");
const ApiFeatures = require("../utils/ApiFeatures");
const { asyncHandler, giveresponse } = require("../utils/res_help");
const path = require("path");
const fs = require("fs");
const Message = require("../models/Message");
const { deleteFile } = require("../utils/commonFunc");

exports.fetchAllMessages = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Messages.find().lean(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await Messages.countDocuments();
 return giveresponse(res, 200, true, "All messages successfully!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.addMessage = asyncHandler(async (req, res, next) => {
 const addMessage = new Messages();

 if (req.file) {
  addMessage.title = req.file.filename;
  addMessage.type = 1;
 } else {
  addMessage.title = req.body.title;
 }

 await addMessage.save();
 return giveresponse(res, 200, true, "Message added successfully!");
});

exports.deleteMessageById = asyncHandler(async (req, res, next) => {
 const temp = await Messages.findById({ _id: req.body._id });
 if (!temp) return giveresponse(res, 404, false, "Message not found");
 if (temp.type == 1) deleteFile(temp.title, "images/");
 await Messages.deleteOne({ _id: req.body._id });
 return giveresponse(res, 200, true, "Message deleted successfully!");
});

exports.updateMessage = asyncHandler(async (req, res, next) => {
 const { _id, title } = req.body;
 const message = await Messages.findOne({ _id: _id });
 if (!message) return giveresponse(res, 404, false, "Message not found");

 if (req.file) {
  deleteFile(message.title, "images/");
  message.title = req.file.filename;
  message.type = 1;
 } else {
  message.title = title;
  message.type = 2;
 }

 await message.save();
 return giveresponse(res, 200, true, "Message data is updated");
});

// ------------------ android api -----------------------

exports.fakeMessagesList = asyncHandler(async (req, res, next) => {
 let [messages, images] = await Promise.all([Message.find({ type: 0 }).select("title -_id").lean(), Message.find({ type: 1 }).select("title -_id").lean()]);
 messages = messages.map((item) => item.title);
 images = images.map((item) => item.title);
 return giveresponse(res, 200, true, "fake message list get success!", { messages, images });
});
