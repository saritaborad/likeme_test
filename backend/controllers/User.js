const User = require("../models/User");
const Country = require("../models/Country");
const PaymentGateway = require("../models/PaymentGateway");
const Gift = require("../models/Gift");
const CoinPlan = require("../models/Subscription");
const Redeem = require("../models/Redeem");
const Message = require("../models/Message");
const Video = require("../models/Video");
const Images = require("../models/Image");
const Report = require("../models/Report");
const App = require("../models/App");
const UserGainTransactionHistory = require("../models/UserGainTransactionHistory");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const jwt = require("jsonwebtoken");
const ApiFeatures = require("../utils/ApiFeatures");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const Subscription = require("../models/Subscription");
const { ObjectId } = require("mongodb");
const HostLiveStreamTrack = require("../models/HostLiveStreamTrack");
const path = require("path");
const { deleteFile } = require("../utils/commonFunc");
const moment = require("moment-timezone");

exports.verifyToken = asyncHandler(async (req, res) => {
 const { authtoken } = req.body;
 const user = jwt.verify(authtoken, process.env.JWT_SECRET);
 return giveresponse(res, 200, true, "token verified", { user: user.id, is_agent: user.is_agent, is_tester: user.is_tester });
});

exports.fetchAllUser = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(User.find().populate("images").select("fullName identity is_fake _id is_block profileimages diamond").lean(), req.body?.options).search().sort().pagination();
 const users = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments();
 return giveresponse(res, 200, true, "All User get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, users });
});

exports.AddCoin = asyncHandler(async (req, res) => {
 const { _id, diamond } = req.body;
 const user = await User.findByIdAndUpdate({ _id }, { $inc: { diamond } }, { new: true });
 return giveresponse(res, 200, true, "Coin added success");
});

exports.userblock = asyncHandler(async (req, res, next) => {
 await User.updateOne({ _id: req.body._id }, { $set: { is_block: req.body.is_block } });
 return giveresponse(res, 200, true, `User ${req.body.is_block == 1 ? "block" : "unblock"} success`);
});

exports.onOff_video_call = asyncHandler(async (req, res) => {
 const { user_id, is_video_call } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exists!");
 user.is_video_call = is_video_call;
 user.save();
 return giveresponse(res, 200, true, "updated success");
});

exports.fetchDashboardCount = asyncHandler(async (req, res) => {
 const pipeline = [
  {
   $group: {
    _id: null,
    users: { $sum: 1 },
    hostApps: { $sum: { $cond: [{ $and: [{ $eq: ["$is_block", 0] }, { $eq: ["$is_host", 1] }] }, 1, 0] } },
    blockHost: { $sum: { $cond: [{ $and: [{ $eq: ["$is_host", 2] }, { $eq: ["$is_block", 1] }] }, 1, 0] } },
    hosts: { $sum: { $cond: [{ $and: [{ $eq: ["$is_host", 2] }, { $eq: ["$is_fake", 0] }] }, 1, 0] } },
   },
  },
  { $lookup: { from: "reports", localField: "_id", foreignField: "userId", as: "reports" } },
  { $addFields: { reports: { $size: "$reports" } } },
  { $lookup: { from: "messages", localField: "_id", foreignField: "userId", as: "messages" } },
  { $addFields: { fakeMsg: { $size: "$messages" } } },
  { $lookup: { from: "countries", localField: "_id", foreignField: "userId", as: "countries" } },
  { $addFields: { countries: { $size: "$countries" } } },
  { $lookup: { from: "gifts", localField: "_id", foreignField: "userId", as: "gifts" } },
  { $addFields: { gifts: { $size: "$gifts" } } },
  { $lookup: { from: "redeems", localField: "_id", foreignField: "userId", as: "redeems" } },
  { $addFields: { redeem: { $size: "$redeems" } } },
  { $lookup: { from: "subscriptions", localField: "_id", foreignField: "userId", as: "subscriptions" } },
  { $addFields: { coinPlans: { $size: "$subscriptions" } } },
  { $lookup: { from: "paymentgetways", localField: "_id", foreignField: "userId", as: "paymentgetways" } },
  { $addFields: { gatway: { $size: "$paymentgetways" } } },
 ];

 const results = await User.aggregate(pipeline);

 if (results.length === 0) {
  return giveresponse(res, 404, false, "No data found.");
 }

 const [{ users, hostApps, blockHost, hosts, reports, fakeMsg, coinPlans, gatway, gifts, countries, redeem }] = results;

 return giveresponse(res, 200, true, "dashboard count get success!", { users, gatway, gifts, fakeMsg, coinPlans, hostApps, blockHost, hosts, reports, countries, redeem });
});

exports.fetchAgentDashboard = asyncHandler(async (req, res) => {
 const allUsers = await User.find({ agent_id: req.body?._id }).select("is_host is_block is_fake").lean();
 const hosts = allUsers.filter((item) => item.is_host == 2 && item.is_fake == 0)?.length;
 const hostApps = allUsers.filter((item) => item.is_host == 1 && item.is_block == 0)?.length;

 return giveresponse(res, 200, true, "agent dashboard get success!", { hosts, hostApps });
});

// --------------- android api --------------------

exports.register = asyncHandler(async (req, res, next) => {
 const { identity, deviceType, loginType, deviceToken, fullName, package_name, email, one_signal_id, gender } = req.body;

 const date = new Date();
 const auth_token = jwt.sign({ identity, date }, process.env.JWT_SECRET);

 let user = await User.findOne({ identity });
 let diamond = await App.findOne({ type: 1 }).select("default_diamond");

 if (!user) {
  const user1 = new User({ identity, loginType, deviceToken, package_name, deviceType, fullName, email, diamond: package_name !== "com.likeme.makematchcall" ? diamond?.default_diamond : 0, one_signal_id, auth_token, gender: gender || "" });
  await user1.save();
  return giveresponse(res, 200, true, "User registered", user1);
 } else {
  const updated = await User.findOneAndUpdate({ identity }, { loginType, deviceType, deviceToken, package_name, one_signal_id, auth_token });
  if (updated) return giveresponse(res, 200, true, "deviceToken & loginType & deviceType &one_signal_id is updated");
  return giveresponse(res, 400, false, "User already registered");
 }
});

exports.registerFast = asyncHandler(async (req, res, next) => {
 const { device_id, identity, gender, deviceType, loginType, deviceToken, fullName, package_name, email, one_signal_id } = req.body;

 let user = await User.findOne({ device_id });
 let diamond = await App.findOne({ type: 1 }).select("default_diamond");

 const date = new Date();
 const auth_token = jwt.sign({ device_id, date }, process.env.JWT_SECRET);
 if (!user) {
  const user1 = new User({ device_id, identity, gender, loginType, deviceToken, package_name, deviceType, fullName, email, diamond: package_name !== "com.likeme.makematchcall" ? diamond?.default_diamond : 0, one_signal_id, auth_token });
  await user1.save();
  return giveresponse(res, 200, true, "User registered", user1);
 } else {
  const updated = await User.findOneAndUpdate({ device_id }, { loginType, deviceType, deviceToken, package_name, one_signal_id, auth_token });
  if (updated) {
   return giveresponse(res, 200, true, "User data updated", updated);
  }
  return giveresponse(res, 400, false, "User already registered");
 }
});

exports.getFast = asyncHandler(async (req, res, next) => {
 const user = await User.findOne({ device_id: req.body.device_id }).populate({ path: "video images country_data", select: "-createdAt -updatedAt -id -__v" });
 if (!user) return giveresponse(res, 404, false, "User not found");
 return giveresponse(res, 200, true, "User data get success!", user);
});

exports.delete_profile = asyncHandler(async (req, res) => {
 const { user_id } = req.body;

 const user_data = await User.findById({ _id: user_id });
 const videos = await Video.find({ user_id }).lean();
 const images = await Images.find({ user_id }).lean();

 if (!user_data) return giveresponse(res, 404, false, "User not found");

 if (user_data.profileimages) deleteFile(user_data.profileimages, "images/");
 for (const image of images) if (image.image) deleteFile(image.image, "images/");

 for (const video of videos) {
  if (video.video || video.thumbnail_image) {
   deleteFile(video.video, "videos/");
   deleteFile(video.thumbnail_image, "images/");
  }
 }

 await Promise.all([Video.deleteMany({ user_id }), Images.deleteMany({ user_id }), User.findOneAndDelete({ _id: user_id })]);
 return giveresponse(res, 200, true, "Profile deleted successfully");
});

exports.getUserProfile = asyncHandler(async (req, res) => {
 const result = await User.findOne({ _id: req.body.user_id }).populate({ path: "video", select: "-createdAt -updatedAt -__v" }).populate({ path: "images", select: "-createdAt -updatedAt -__v" }).populate({ path: "country_data", select: "-createdAt -updatedAt -__v -id" });
 if (!result) return giveresponse(res, 404, false, "User not found!");
 return giveresponse(res, 200, true, "Data fetch success!", result);
});

exports.userProfileUpdate = asyncHandler(async (req, res, next) => {
 const { user_id, fullName, loginType, email } = req.body;

 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 400, false, "User doesn't exist!", null);

 user.fullName = fullName;
 if (loginType) user.loginType = loginType;
 if (email) user.email = email;

 if (req.file) {
  deleteFile(user.profileimages, "images/");
  user.profileimages = req.file.filename;
 }
 await user.save();

 const result = await User.findOne({ _id: user_id }).populate("video images country_data").lean();
 if (result) return giveresponse(res, 200, true, "Data updated", result);
});

exports.userVersionUpdate = asyncHandler(async (req, res, next) => {
 const user = await User.findOne({ _id: req.body.user_id });
 if (!user) return giveresponse(res, 200, true, "Version updated successfully!");
 user.version = req.body.version;
 await user.save();
 return giveresponse(res, 200, true, "Version updated successfully!");
});

exports.logOut = asyncHandler(async (req, res, next) => {
 const result = await User.findByIdAndUpdate({ _id: req.body.user_id }, { deviceToken: null, one_signal_id: "" }, { new: true });
 if (result) return giveresponse(res, 200, true, "device logout success.");
});

exports.diamondMinus = asyncHandler(async (req, res) => {
 const { user_id, host_id, diamond, spend_type, package_name } = req.body;

 const user = await User.findOne({ _id: user_id }).select("diamond");

 if (user.diamond < parseInt(diamond)) {
  return giveresponse(res, 400, false, "Insufficient coin", { diamond: user.diamond });
 } else {
  const totalDiamond = user.diamond - parseInt(diamond);
  const update = await User.findOneAndUpdate({ _id: user_id }, { diamond: totalDiamond });
  if (update) {
   const spend = new UserSpendTransactionHistory({ type: spend_type, send_by: user_id, received_by: host_id, diamond: diamond, package_name: package_name, host_paided: 1 });

   await spend.save();
   req.body.user_id = host_id;
   req.body.type = 1; // 1= host gain added dimond / 2= user purchased dimond
   await addDiamond(req, res); // add diamond to host
   return giveresponse(res, 200, true, "Coin minus success", { diamond: totalDiamond });
  }
  return giveresponse(res, 400, false, "Something went wrong");
 }
});

exports.diamondPlus = asyncHandler(async (req, res) => {
 const { diamond, genratedId } = await addDiamond(req, res);
 return giveresponse(res, 200, true, "coin increment successfull !", { diamond, genratedId });
});

exports.listOrder = asyncHandler(async (req, res) => {
 const userGainHistory = await UserGainTransactionHistory.find({ user_id: req.body.user_id }).sort({ createdAt: -1 }).select("-updatedAt  -__v -id").lean();
 if (userGainHistory.length == 0) return giveresponse(res, 404, false, "Data not found!");
 return giveresponse(res, 200, true, "user gain history get success", userGainHistory);
});

exports.diamondUpdate = asyncHandler(async (req, res) => {
 const { user_id, genrated_id, sku, purchase_token, GPA_TOKEN } = req.body;
 let diamond = req.body.diamond;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist");
 const userGainHistory = await UserGainTransactionHistory.findOne({ _id: genrated_id });
 if (!userGainHistory) return giveresponse(res, 404, false, "transaction not found");
 if (userGainHistory.diamond == 0) {
  if (diamond != 0) {
   const diamondD = await Subscription.findOne({ play_store_id: sku });
   if (diamondD.diamond) diamond = diamondD.diamond;
  }
  user.diamond += parseInt(diamond);
  user.save();
  userGainHistory.diamond = diamond;
  userGainHistory.sku = sku;
  userGainHistory.GPA_TOKEN = GPA_TOKEN || null;
  userGainHistory.purchase_token = purchase_token;
  userGainHistory.save();
 }
 return giveresponse(res, 200, true, "diamond update success", { diamond: user.diamond });
});

exports.interestedCountry = asyncHandler(async (req, res) => {
 const { user_id, country_list } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found!");
 const countryIds = country_list.map((countryId) => new ObjectId(countryId));
 await User.findOneAndUpdate({ _id: user_id }, { $addToSet: { interested_country: { $each: countryIds } } });
 return giveresponse(res, 200, true, "country updated successfully!");
});

exports.userlanguage = asyncHandler(async (req, res) => {
 const { user_id, language } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found!");
 user.language = language;
 await user.save();
 return giveresponse(res, 200, true, "Language updated successfully!");
});

exports.save_profile = asyncHandler(async (req, res) => {
 const { user_id, host_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist");
 if (user.save_profile.includes(host_id)) return giveresponse(res, 200, true, "User has already saved this profile!");
 user.save_profile.push(new ObjectId(host_id));
 await user.save();
 return giveresponse(res, 200, true, "Profile saved successfully!");
});

exports.get_saved_profile = asyncHandler(async (req, res) => {
 const { user_id, start, limit } = req.body;

 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found!");

 if (user.save_profile.length === 0) return giveresponse(res, 404, false, "No saved profile found");

 const idsToRetrieve = user.save_profile.slice(start, start + limit);
 const userData = await User.find({ _id: { $in: idsToRetrieve }, is_block: 0 })
  .select("-createdAt -updatedAt -__v")
  .populate({ path: "video images country_data", select: "-createdAt -updatedAt -__v -id" })
  .lean();
 if (userData.length == 0) return giveresponse(res, 200, true, "Data not found!", []);
 return giveresponse(res, 200, true, "save profile data fetch success!", userData);
});

exports.remove_from_save = asyncHandler(async (req, res) => {
 const { user_id, host_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found!");
 await User.findOneAndUpdate({ _id: user_id }, { $pull: { save_profile: new ObjectId(host_id) } }, { new: true });
 return giveresponse(res, 200, true, "Removed from saved successfully!");
});

exports.updateUserCallStatus = asyncHandler(async (req, res) => {
 const { my_user_id, call_status, to_user_id } = req.body;

 let toUser;
 let myUser = await User.findById({ _id: my_user_id });

 if (!myUser) return giveresponse(res, 404, false, "My user not found");

 if (to_user_id) {
  toUser = await User.findById({ _id: to_user_id });

  if (!toUser) return giveresponse(res, 404, false, "To user not found");
 }

 if ((toUser && toUser.call_status == 0) || toUser == null) {
  myUser.call_status = call_status;
  myUser.save();
 }

 return giveresponse(res, 200, true, "Call Status updated successfully", { my_user: myUser, to_user: toUser });
});

exports.fetchBlockList = asyncHandler(async (req, res) => {
 const { user_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "Use doesn't exists!");
 const results = await User.find({ _id: { $in: user.is_block_list || [] } })
  .select("-createdAt -updatedAt -__v -id")
  .populate({ path: "images video country_data", select: "-createdAt -updatedAt -__v -id" })
  .lean();

 if (results.length == 0) return giveresponse(res, 400, false, "No blocked host found!");
 return giveresponse(res, 200, true, "Block List get success!", results);
});

exports.chatImageApi = asyncHandler(async (req, res) => {
 if (req.file) {
  if (req.file.mimetype.startsWith("image")) {
   // Handle image uploads
   const chatImage = req.file.filename;
   const json_data = { status: true, msg: "Image stored", chat_image: chatImage };
   res.json(json_data);
  } else if (req.file.mimetype.startsWith("video")) {
   // Handle video uploads
   const chatVideo = req.file.filename;
   const thumbnailFilename = path.basename(chatVideo, path.extname(chatVideo)) + ".jpg";
   const thumbnailImage = "uploads/" + thumbnailFilename;

   // Generate a thumbnail from the video
   ffmpeg(chatVideo)
    .setFfmpegPath("/path/to/ffmpeg") // Set the path to your FFmpeg executable
    .screenshots({
     count: 1,
     folder: "uploads",
     filename: thumbnailFilename,
    })
    .on("end", () => {
     const json_data = {
      status: true,
      msg: "Video and thumbnail stored",
      chat_video: chatVideo,
      thumbnail_image: thumbnailImage,
     };
     res.json(json_data);
    });
  }
 } else {
  const json_data = { status: false, msg: "File not received", chat_image: null, thumbnail_image: null };
  res.json(json_data);
 }
});

exports.chatImageDeleteApi = asyncHandler(async (req, res) => {
 try {
  const fileId = req.params.id;
  const file = await FileModel.findOne({ _id: ObjectId(fileId) });

  if (!file) {
   return res.json({ status: false, msg: "Data not found" });
  }

  // Assuming 'path' is a field in your MongoDB document that stores the file path
  const filePath = file.path;

  // Delete the file from the server
  const fs = require("fs");
  if (fs.existsSync(filePath)) {
   fs.unlinkSync(filePath);
   await FileModel.deleteOne({ _id: ObjectId(fileId) });
   return res.json({ status: true, msg: "Data deleted" });
  } else {
   return res.json({ status: false, msg: "Data not found" });
  }
 } catch (error) {
  console.error(error);
  return res.status(500).json({ status: false, msg: "Server error" });
 }
});

exports.host_live_stream_track = asyncHandler(async (req, res) => {
 const { host_id, event, session } = req.body;
 if (event === "start") {
  const hostLiveStreamTrack = new HostLiveStreamTrack({ host_id: host_id, start: new Date() });
  await hostLiveStreamTrack.save();
  return giveresponse(res, 200, true, "success", hostLiveStreamTrack._id);
 } else if (event === "end") {
  await HostLiveStreamTrack.findOneAndUpdate({ _id: session }, { end: new Date() }, { new: true });
  return giveresponse(res, 200, true, "success", session);
 }
});

exports.host_live_stream_track_history = asyncHandler(async (req, res) => {
 const { host_id } = req.body;
 let today = new Date();
 today.setHours(0, 0, 0, 0);

 const todaySessions = await HostLiveStreamTrack.countDocuments({ host_id, start: { $gte: today } });
 const todaySessionTime = await HostLiveStreamTrack.aggregate([{ $match: { host_id: new ObjectId(host_id), start: { $gte: today } } }, { $group: { _id: null, total_minutes: { $sum: { $subtract: ["$end", "$start"] } } } }]);

 const json_data = { today_session: todaySessions, today_session_time: todaySessionTime[0] ? todaySessionTime[0].total_minutes : 0 };
 return giveresponse(res, 200, true, "success", json_data);
});

exports.host_live_stream_track_history_list = asyncHandler(async (req, res) => {
 let { host_id, from, to, zone } = req.body;

 if (zone) {
  from = new Date(from).toLocaleString("en-US", { timeZone: zone });
  to = new Date(to).toLocaleString("en-US", { timeZone: zone });
 }

 const sessionList = await HostLiveStreamTrack.aggregate([{ $match: { host_id: new ObjectId(host_id), start: { $gte: new Date(from), $lte: new Date(to) } } }, { $group: { _id: "$_id", total_minutes: { $sum: { $subtract: ["$end", "$start"] } }, host_id: { $first: "$host_id" }, start: { $first: "$start" }, end: { $first: "$end" } } }, { $project: { total_minutes: 1, host_id: 1, start: 1, end: 1 } }]);

 const totalSessionTime = sessionList.reduce((total, session) => total + session.total_minutes, 0);
 const totalSessionHours = Math.floor(totalSessionTime / 3600);
 const totalSessionMinutes = Math.floor((totalSessionTime % 3600) / 60);
 const totalSession = sessionList.length;

 if (zone) {
  sessionList.forEach((session) => {
   session.start = new Date(session.start).toLocaleString("en-US", { timeZone: zone });
   session.end = new Date(session.end).toLocaleString("en-US", { timeZone: zone });
  });
 }

 const json_data = {
  total_session: totalSession.toString(),
  total_session_time: `${totalSessionHours}:${totalSessionMinutes}`,
  session_list: sessionList,
 };
 return giveresponse(res, 200, true, "success", json_data);
});

exports.multiUser = asyncHandler(async (req, res, next) => {
 const result = await User.find({ _id: { $in: req.body.id } }).lean();
 if (result.length > 0) {
  return giveresponse(res, 200, true, "Data get success", result);
 } else {
  return giveresponse(res, 404, false, "Data not found", []);
 }
});

const addDiamond = asyncHandler(async (req, res) => {
 const { gain_type, user_id, type, diamond, GPA_TOKEN, version, package_name } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 200, true, "User doesn't exists");
 let genratedId;
 if (type == 2) {
  const gain = new UserGainTransactionHistory({ type: gain_type, user_id, diamond, GPA_TOKEN: GPA_TOKEN || null, version: version || null, package_name: package_name || null });
  await gain.save();
  genratedId = gain._id;
 }
 user.diamond += parseInt(diamond);
 if (type == 1) user.total_diamond += parseInt(diamond);
 await user.save();
 return { diamond: user.diamond, genratedId };
});
