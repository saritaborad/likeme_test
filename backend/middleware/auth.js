const User = require("../models/User");
const { tokenFromCookie } = require("../utils/jwtToken");
const { giveresponse } = require("../utils/res_help");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
 let token;

 if ((req.headers.authorization && req.headers.authorization.startsWith("Bearer")) || req.headers.cookie) {
  token = req.headers.authorization?.split(" ")[1] || tokenFromCookie(req.headers.cookie);
 }

 if (!token) return giveresponse(res, 403, false, "Not authorize to access this route");

 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.urole = decoded.role;
  req.user = await User.findById(decoded.id);
  next();
 } catch (error) {
  return giveresponse(res, 403, false, error.message);
 }
};

const authorize = (...roles) => {
 return (req, res, next) => {
  if (!roles.includes(req.urole)) {
   return giveresponse(res, 403, false, `User role ${req.urole} is not authorized to access this route`);
  }
  next();
 };
};

module.exports = { authenticate };
