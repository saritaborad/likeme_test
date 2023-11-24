const Admob = require("../models/Admob");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const App = require("../models/App");
const agora = require("agora-token");

exports.getSettingData = asyncHandler(async (req, res, next) => {
 const data = await App.findOne();
 return giveresponse(res, 200, true, "setting data get success", data);
});

exports.updateSettingApp = asyncHandler(async (req, res, next) => {
 const { app_name, default_diamond, amount_per_diamond, currency, min_threshold, min_diamonds_charge_for_going_live, watch_ad_diamond, user_message_charge, host_message_charge, host_call_charge, host_live_Percentage, minimumMinuts, chargeForLive, max_live_time, max_live_private_time, agora_app_id, agora_app_cert, _id, match_call_coin, match_call_second, max_fake_live_hosts, fake_host_vidoe_from, liveSwitch } = req.body;
 const result = await App.updateOne({ _id }, { $set: { app_name, default_diamond, amount_per_diamond, currency, min_threshold, min_diamonds_charge_for_going_live, watch_ad_diamond, user_message_charge, agora_app_id, agora_app_cert, host_message_charge, host_call_charge, host_live_Percentage, minimumMinuts, chargeForLive, max_live_time, max_live_private_time, match_call_coin, match_call_second, max_fake_live_hosts, fake_host_vidoe_from, liveSwitch } });
 return giveresponse(res, 200, true, "settings updated");
});

exports.getAdmob = asyncHandler(async (req, res, next) => {
 const admobData = await Admob.findOne({ type: req.body.type }).lean();
 return giveresponse(res, 200, true, "Admob data get success", admobData);
});

exports.updateAdmob = asyncHandler(async (req, res, next) => {
 const { type, rewarded_id } = req.body;
 const data = await Admob.findOneAndUpdate({ type }, { $set: { rewarded_id } }, { new: true });
 if (!data) return giveresponse(res, 404, false, "Data not found");
 return giveresponse(res, 200, true, "Data is updated", data);
});

exports.liveSwitch = asyncHandler(async (req, res, next) => {
 const result = await App.updateOne({ id: req.body.appId }, { liveSwitch: req.body.liveSwitch });

 if (result) {
  return giveresponse(res, 200, true, "Switch updated successfully.");
 } else {
  return giveresponse(res, 404, false, "App not found.");
 }
});

exports.setting = asyncHandler(async (req, res, next) => {
 const data = await Admob.find();

 const androidAdmob = data[0];
 const iOSAdmob = data[data.length - 1];

 return giveresponse(res, 200, true, "setting get success", { androidAdmob, iOSAdmob });
});

// ------------------- android api ------------------------

exports.all_setting = asyncHandler(async (req, res, next) => {
 const appResult = await App.findOne().select("-createdAt -updatedAt -__v").lean();
 const admobResult = await Admob.find().select("-createdAt -updatedAt -__v").lean();
 return giveresponse(res, 200, true, "Data fetched successfully!", { app: appResult, android: admobResult[0], ios: admobResult[admobResult.length - 1] });
});

exports.generateAgoraToken = asyncHandler(async (req, res, next) => {
 const { channelName } = req.body;
 const appInfo = await App.findOne({});

 const appID = appInfo.agora_app_id;
 const appCertificate = appInfo.agora_app_cert;
 const role = agora.RtcRole.PUBLISHER;
 const expireTimeInSeconds = 3600;
 const uid = 0; // The user ID, set to 0 for server-side token

 const currentTimestamp = Math.floor(Date.now() / 1000);
 const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

 const token = agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

 return giveresponse(res, 200, true, "Agora token generate success", token);
});

exports.editAgoraToken = asyncHandler(async (req, res, next) => {
 const { agora_app_id, agora_app_cert } = req.body;
 const result = await App.findOneAndUpdate({ _id: id }, { agora_app_cert, agora_app_id }, { new: true }).lean();
 return giveresponse(res, 200, true, "data updated!");
});
