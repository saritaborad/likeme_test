const UserGainTransactionHistory = require("../models/UserGainTransactionHistory");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const NotificationPackagename = require("../models/NotificationPackagename");
const ApiFeatures = require("../utils/ApiFeatures");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const moment = require("moment-timezone");
const User = require("../models/User");

exports.fetchAllPurchaseHistory = asyncHandler(async (req, res, next) => {
 const gain_type = parseInt(req.body.gain_type);
 const package_name = req.body.package_name || "com.likeme.makematchcall";
 const from = req.body.from;
 const to = req.body.to;

 let query = { diamond: { $ne: 0 }, ...(gain_type == 0 ? { type: { $in: [1, 2] } } : gain_type ? { type: gain_type } : {}), ...(package_name ? { package_name: package_name } : {}), ...(from && to ? { createdAt: { $gte: new Date(from), $lte: new Date(to) } } : {}) };

 const apiFeature = new ApiFeatures(UserGainTransactionHistory.find(query).populate({ path: "user", select: "fullName email identity" }).lean(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await UserGainTransactionHistory.countDocuments(query);
 let grandTotal = data.reduce((total, item) => total + item.diamond, 0);

 return giveresponse(res, 200, true, "Purchase history get success", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data, grandTotal });
});

// exports.fetchAllSpendHistory = asyncHandler(async (req, res, next) => {
//  const { _id } = req.body;
//  const apiFeature1 = new ApiFeatures(UserSpendTransactionHistory.find({ send_by: _id }).populate("user host"), req.body).search().sort().pagination();
//  const apiFeature2 = new ApiFeatures(UserGainTransactionHistory.find({ $and: [{ user_id: _id }, { diamond: { $ne: 0 } }] }).populate("user"), req.body).search().sort().pagination();

//  const spendHistory = await apiFeature1.query;
//  const gainHistory = await apiFeature2.query;
//  apiFeature1.totalRecord = await UserSpendTransactionHistory.countDocuments({ send_by: _id });
//  apiFeature2.totalRecord = await UserGainTransactionHistory.countDocuments({ $and: [{ user_id: _id }, { diamond: { $ne: 0 } }] });

//  const data = [];
//  let spend_end = "";
//  let status;

//  for (const item of gainHistory) {
//   let gainBy = item.type == 1 ? "Purchase" : "Rewarded";

//   status = "Credit";

//   const convertedTime = moment(item.createdAt).format("YYYY-MM-DD hh:mm:ss");
//   if (item.diamond > 0) {
//    for (const item2 of spendHistory) {
//     const spendIn = ["gift", "call", "stream", "chat", "match"][item.type - 1];

//     status = "Debit";

//     const dateTime_ = moment(item2.createdAt).format("YYYY-MM-DD hh:mm:ss");

//     if (item2.createdAt > item.createdAt) {
//      if (spend_end === "" || spend_end > item2.createdAt) {
//       data.push({ spendIn, caller: item2.user.fullName, host: item2.host.fullName, credit: "--", debit: item2.diamond, payment: status, date: dateTime_ });
//       spend_end = item2.createdAt;
//      }
//     }
//    }

//    data.push({ spendIn: gainBy, caller: item.user.fullName, host: item.GPA_TOKEN, credit: item.diamond, debit: "--", payment: status, date: convertedTime });
//   }
//  }

//  return giveresponse(res, 200, true, "Spend history get success", data);
// });

exports.fetchAllSpendHistory = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 const userSpend = UserSpendTransactionHistory.find({ send_by: _id }).populate("user host").lean();
 const userGain = UserGainTransactionHistory.find({ $and: [{ user_id: _id }, { diamond: { $ne: 0 } }] })
  .populate("user")
  .lean();

 const apiFeature1 = new ApiFeatures(userSpend, req.body).search().sort().pagination();
 const apiFeature2 = new ApiFeatures(userGain, req.body).search().sort().pagination();

 const [spendHistory, gainHistory] = await Promise.all([apiFeature1.query, apiFeature2.query]);
 apiFeature1.totalRecord = await UserSpendTransactionHistory.countDocuments();
 apiFeature2.totalRecord = await UserGainTransactionHistory.countDocuments();

 const total_spend = spendHistory.reduce((total, item) => total + item.diamond, 0);
 const total_gain = gainHistory.reduce((total, item) => total + item.diamond, 0);

 const total_purchase = await UserGainTransactionHistory.countDocuments({ user_id: _id });
 const avail_bal = await User.findOne({ _id }).select("diamond ").lean();

 const data = [];
 let spend_end = "";
 let status;

 for (const item of gainHistory) {
  let gainBy = item.type == 1 ? "Purchase" : item.type == 2 ? "Rewarded" : "Vip";

  status = "Credit";

  const convertedTime = moment(item.createdAt).format("YYYY-MM-DD hh:mm:ss");
  if (item.diamond > 0) {
   for (const item2 of spendHistory) {
    const spendIn = ["gift", "call", "stream", "chat", "match"][item2.type - 1];

    status = "Debit";

    const dateTime_ = moment(item2.createdAt).format("YYYY-MM-DD hh:mm:ss");

    if (item2.createdAt > item.createdAt) {
     if (spend_end === "" || spend_end > item2.createdAt) {
      data.push({ spendIn, caller: item2.user.fullName, host: item2.host.fullName, credit: "--", debit: item2.diamond, payment: "Debit", date: dateTime_ });
      spend_end = item2.createdAt;
     }
    }
   }

   data.push({ spendIn: gainBy, caller: item.user.fullName, host: item.GPA_TOKEN, credit: item.diamond, debit: "--", payment: "Credit", date: convertedTime });
  }
 }

 return giveresponse(res, 200, true, "Spend history get success", { data, total_spend, total_gain, total_purchase, avail_bal: avail_bal?.diamond });
});

exports.getPackageName = asyncHandler(async (req, res, next) => {
 const packageName = await NotificationPackagename.find().select("package_name app_name device_type").sort({ _id: -1 }).lean();
 return giveresponse(res, 200, true, "package name get success", packageName);
});

exports.fetchAllSortPurchased = asyncHandler(async (req, res, next) => {
 const { sizePerPage, page } = req.body?.options;
 const limit = Number(sizePerPage) || 10;

 let data = await UserGainTransactionHistory.aggregate([
  { $match: { type: 1, diamond: { $ne: 0 } } },
  { $group: { _id: "$user_id", count: { $sum: 1 }, diamond_: { $sum: "$diamond" } } },
  { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
  { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },
  { $match: { user: { $exists: true } } },
  { $project: { _id: 1, count: 1, diamond_: 1, "user.fullName": 1, "user.identity": 1 } },
  { $match: { diamond_: { $gt: 1000 } } },
  {
   $facet: {
    totalRecord: [{ $count: "total" }],
    data: [{ $sort: { diamond_: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }],
   },
  },
  { $project: { totalRecord: { $first: "$totalRecord.total" }, data: 1 } },
 ]);
 let totalRecord = data.length > 0 ? data[0]?.totalRecord : 0;
 const totalPage = Math.ceil(totalRecord / sizePerPage);
 result = { totalPage, totalRecord, data: data[0]?.data };
 return giveresponse(res, 200, true, "purchase sort success", result);
});

exports.notiSortPurchased = asyncHandler(async (req, res, next) => {
 const { _id, message, description } = req.body;
 const user = await User.findOne({ _id }).select("deviceToken");
 const url = "https://fcm.googleapis.com/fcm/send";
 const data = await NotificationPackagename.find();
 let result;
 for (const item of data) {
  const notification = { title: message, body: description, sound: "default", badge: "1", user_id: _id };

  const fields = {
   to: user?.deviceToken,
   data: notification,
   priority: "high",
  };

  const headers = { "Content-Type": "application/json", Authorization: "key=" + item.fcm_key };

  const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(fields) });

  result = await response.json();
 }
 if (result["success"] == 1) {
  return giveresponse(res, 200, true, "Notification sent success!");
 } else {
  return giveresponse(res, 400, false, result["results"]);
 }
});
