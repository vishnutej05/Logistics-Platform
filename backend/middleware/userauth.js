// const User = require("../models/User");
// const authMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || "your_secret_key"
//     );
//     req.user = await User.findById(decoded.userId); // Set user info in request

//     // Optionally, you can also fetch booking info here if needed
//     // const booking = await Booking.findOne({ user: req.user._id }); // Example, modify as needed

//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Make sure to import the User model

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.userId = verified.userId; // Assuming the token contains userId
    req.role = verified.role; // Assuming the token contains role
    // console.log(verified);
    // Fetch the user and attach it to req if needed
    req.user = await User.findById(req.userId);
    if (!req.user) {
      return res.status(404).json({ message: "User not found." });
    }

    next(); // Continue to the next middleware/route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid Token." });
  }
};

module.exports = auth;
