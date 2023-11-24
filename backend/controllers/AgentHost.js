const Agent = require("../models/Agent");
const HostLiveStreamTrack = require("../models/HostLiveStreamTrack");
const User = require("../models/User");
const Redeem = require("../models/Redeem");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const { asyncHandler, giveresponse } = require("../utils/res_help");
const moment = require("moment-timezone");
const ApiFeatures = require("../utils/ApiFeatures");
const { ObjectId } = require("mongodb");

exports.getAgentHosts = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;

 const pendingRedeemV = {};
 const streaming_timev = {};
 let subtotal = 0;

 const dateTime = moment().tz("Asia/Kolkata").add(1, "days").toDate();

 const pendingRedeem = await UserSpendTransactionHistory.aggregate([{ $match: { host_paided: 1, createdAt: { $lte: dateTime } } }, { $group: { _id: "$received_by", total: { $sum: "$diamond" } } }]);

 pendingRedeem.forEach((item) => (pendingRedeemV[item._id] = item.total));

 const apiFeature = new ApiFeatures(User.find({ agent_id: _id, is_block: 0 }).select("fullName profileimages version identity"), req.body?.options).search().sort().pagination();
 const agent_hosts = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments({ agent_id: _id, is_block: 0 });

 const hostIds = agent_hosts.map((host) => host._id);

 const agent = await Agent.findOne({ _id: _id });
 const stream_minits = agent?.stream_minits;

 let currentDate = moment();
 let redeemLastDate = await Redeem.findOne().sort({ createdAt: -1 });
 const lastRedeemDate = moment(redeemLastDate?.createdAt);
 const diff = currentDate.diff(lastRedeemDate, "days");
 const DaysAgo = moment().subtract(diff, "days");

 const streaming_time = await HostLiveStreamTrack.aggregate([{ $match: { host_id: { $in: hostIds }, start: { $gte: DaysAgo.toDate() } } }, { $group: { _id: "$host_id", total_time: { $sum: { $subtract: ["$end", "$start"] } } } }]);

 streaming_time.forEach((item) => (streaming_timev[item._id] = item.total_time / 60000));

 const agentHost = await Promise.all(
  agent_hosts.map(async (agent_host) => {
   if (pendingRedeemV[agent_host._id]) subtotal += pendingRedeemV[agent_host._id];

   const streamTracks = await HostLiveStreamTrack.aggregate([
    {
     $match: {
      host_id: agent_host._id,
      start: { $gte: DaysAgo.toDate() },
     },
    },
    {
     $group: {
      _id: { host_id: "$host_id", date: { $dateToString: { format: "%Y-%m-%d", date: "$start" } } },
      count: { $sum: 1 },
      date: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$start" } } },
      time_diff: { $sum: { $divide: [{ $subtract: ["$end", "$start"] }, 1000] } }, // convert difference in seconds
     },
    },
    {
     $match: {
      time_diff: { $gt: stream_minits * 60 },
     },
    },
   ]);

   const updatedAgentHost = { ...agent_host?._doc, count: streamTracks.length || 0, diamond: pendingRedeemV[agent_host._id] || 0, total_time: streaming_timev[agent_host._id] || 0 };
   return updatedAgentHost;
  })
 );

 return giveresponse(res, 200, true, "agent host get", { agentHost, subtotal, totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage });
});

exports.fetchAllStreamHistory = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 const apiFeature = new ApiFeatures(HostLiveStreamTrack.find({ host_id: _id }).lean(), req.body?.options).search().sort().pagination();
 const history = await apiFeature.query;
 apiFeature.totalRecord = await HostLiveStreamTrack.countDocuments({ host_id: _id });
 const streamTracks = await HostLiveStreamTrack.aggregate([{ $match: { host_id: new ObjectId(_id) } }, { $group: { _id: "$host_id", session_time: { $sum: { $divide: [{ $subtract: ["$end", "$start"] }, 1000] } } } }, { $project: { _id: 0, session_time: 1 } }]);

 return giveresponse(res, 200, true, "fetch all stream history success", { data: history, totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, session_time: streamTracks[0]?.session_time });
});

exports.fetchStreamHistoryDayWise = asyncHandler(async (req, res, next) => {
 const { _id, from, to, options } = req.body;

 const page = options?.page || 1;
 const limit = Number(options?.sizePerPage) || 10;
 const startIndex = (page - 1) * limit;

 let publicStreams = [];

 const startDate = moment.utc(from).toDate();
 const endDate = moment.utc(to).toDate();

 publicStreams = await HostLiveStreamTrack.aggregate([{ $match: { host_id: new ObjectId(_id), start: { $gte: startDate, $lte: endDate } } }, { $group: { _id: { stream_date: { $dateToString: { format: "%Y-%m-%d", date: "$start" } } }, stream_count: { $sum: 1 }, total_duration: { $sum: { $divide: [{ $subtract: ["$end", "$start"] }, 1000] } } } }, { $project: { _id: 0, stream_date: "$_id.stream_date", stream_count: 1, total_duration: 1 } }, { $facet: { totalRecord: [{ $count: "total" }], data: [{ $sort: { stream_date: -1 } }, { $skip: startIndex }, { $limit: limit }] } }, { $project: { totalRecord: { $first: "$totalRecord.total" }, data: 1 } }]);

 let totalRecord = publicStreams.length > 0 ? publicStreams[0]?.totalRecord : 0;
 const totalPage = Math.ceil(totalRecord / limit);
 result = { totalPage, totalRecord, data: publicStreams[0]?.data };

 return giveresponse(res, 200, true, "day wise stream history get success", !from && !to ? [] : result);
});

exports.fetchAllHostHistory = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;

 let totalPaid = 0;
 let totalUnPaid = 0;

 const apiFeature = new ApiFeatures(UserSpendTransactionHistory.find({ received_by: _id }).populate({ path: "user host", select: "fullName" }).lean(), req.body?.options).search().sort().pagination();
 const history = await apiFeature.query;
 apiFeature.totalRecord = await UserSpendTransactionHistory.countDocuments({ received_by: _id });
 const data = await UserSpendTransactionHistory.find({ received_by: _id }).lean();
 data.forEach((item) => (item?.host_paided === 2 ? (totalPaid += item?.diamond) : (totalUnPaid += item?.diamond)));

 return giveresponse(res, 200, true, "Host history get success", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, history, totalPaid, totalUnPaid });
});

exports.fetchHostSummary = asyncHandler(async (req, res, next) => {
 const { _id, from, to } = req.body;
 const payment = parseInt(req.body.payment);

 const matchStage = { received_by: new ObjectId(_id), type: { $in: [1, 2, 3, 4, 5] } };
 const streamComman = { host_id: new ObjectId(_id) };

 if (payment != 0) matchStage.host_paided = payment;

 if (from != 0 && to != 0) {
  matchStage.createdAt = { $gte: moment.utc(from).toDate(), $lte: moment.utc(to).toDate() };
  streamComman.start = { $gte: moment.utc(from).toDate(), $lte: moment.utc(to).toDate() };
 }

 const pipeline = [{ $match: matchStage }, { $group: { _id: "$type", total: { $sum: "$diamond" } } }];
 const streamPipeline = [{ $match: streamComman }, { $group: { _id: "$host_id", total_time: { $sum: { $divide: [{ $subtract: ["$end", "$start"] }, 1000] } } } }];

 const result = await UserSpendTransactionHistory.aggregate(pipeline);
 const streaming_time = await HostLiveStreamTrack.aggregate(streamPipeline);
 const public_streams = await HostLiveStreamTrack.countDocuments(streamComman);

 const typeTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

 result.forEach((item) => (typeTotals[item._id] = item.total));
 const grandTotal = Object.values(typeTotals).reduce((total, value) => total + value, 0);

 const data = { gift: typeTotals[1], call: typeTotals[2], stream: typeTotals[3], chat: typeTotals[4], match: typeTotals[5], total: grandTotal, streaming_time: streaming_time?.length == 0 ? 0 : streaming_time?.[0]?.total_time, public_streams: public_streams };

 return giveresponse(res, 200, true, "Host History get success.", data);
});

exports.getHostAgents = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 let query = { agent_id: _id, is_host: 2, is_fake: 0 };

 const apiFeature = new ApiFeatures(User.find(query).populate("images").select("fullName identity profileimages is_block diamond").lean(), req.body?.options).search().sort().pagination();
 const users = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments(query);

 const dateTime = moment().tz("Asia/Kolkata").add(1, "days").toDate();

 const pendingRedeemV = {};
 let subtotal = 0;

 const pendingRedeem = await UserSpendTransactionHistory.aggregate([{ $match: { host_paided: 1, createdAt: { $lte: dateTime } } }, { $group: { _id: "$received_by", total: { $sum: "$diamond" } } }]);

 pendingRedeem.forEach((item) => {
  pendingRedeemV[item._id] = item.total;
 });

 const agent = await Agent.findOne({ _id: _id });
 const stream_minits = agent?.stream_minits;

 let currentDate = moment();
 let redeemLastDate = await Redeem.findOne().sort({ createdAt: -1 });
 const lastRedeemDate = moment(redeemLastDate.createdAt);
 const diff = currentDate.diff(lastRedeemDate, "days");
 const DaysAgo = moment().subtract(diff, "days");

 const agentHost = await Promise.all(
  users.map(async (user) => {
   if (pendingRedeemV[user._id]) subtotal += pendingRedeemV[user._id];

   const streamTracks = await HostLiveStreamTrack.aggregate([
    {
     $match: {
      host_id: user._id,
      start: { $gte: DaysAgo.toDate() },
     },
    },
    {
     $group: {
      _id: { host_id: "$host_id", date: { $dateToString: { format: "%Y-%m-%d", date: "$start" } } },
      count: { $sum: 1 },
      date: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$start" } } },
      time_diff: { $sum: { $divide: [{ $subtract: ["$end", "$start"] }, 1000] } }, // convert difference in seconds
     },
    },
    {
     $match: {
      time_diff: { $gt: stream_minits * 60 },
     },
    },
   ]);

   const updatedAgentHost = { ...user?._doc, count: streamTracks.length || 0, diamond: pendingRedeemV[user._id] || 0 };
   return updatedAgentHost;
  })
 );
 return giveresponse(res, 200, true, "agent host get", { agentHost, subtotal, totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage });
});

exports.fetchAllHost_historyApi = asyncHandler(async (req, res, next) => {
 const { id, skip, limit } = req.body;
 const history = await UserSpendTransactionHistory.find({ received_by: id, host_paided: 1 }).populate({ path: "user", select: "fullName" }).populate({ path: "host", select: "fullName" }).skip(parseInt(skip)).limit(parseInt(limit)).sort({ _id: -1 }).lean();

 const data = history.map((historys) => {
  const spendInOptions = ["gift", "call", "stream", "chat", "match"];
  const spendIn = spendInOptions[historys.type - 1];
  const dateTime = new Date(historys.createdAt);
  const convertedTime = dateTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  return { spend_in: spendIn, user_fullName: historys.user?.fullName, host_fullName: historys.host?.fullName, diamond: historys.diamond, host_paided: historys.host_paided, date: convertedTime };
 });
 return giveresponse(res, 200, true, "Data get success!", data);
});
