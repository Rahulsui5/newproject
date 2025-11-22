import userModel from "../models/userModel.js";

// export const authMiddleware = async (req, res, next) => {
//   try {
//     // Extract token from Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied! No token provided",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }

//     // Attach user to request
//     const user = await userModel.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Auth Error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Authentication failed",
//       error: error.message,
//     });
//   }
// };

export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "Access denied! Admins only",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin access error",
      error: error.message,
    });
  }
};
