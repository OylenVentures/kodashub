const jwt = require("jsonwebtoken");
const { prisma } = require("./connect");

exports.authenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token is required for authentication" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const foundUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = foundUser;
  } catch (error) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
  return next();
};

exports.authorized = (...role) => {
  return (req, res, next) => {
    if (!role?.includes(req.user.role)) {
      return res
        .status(403)
        .send({ message: "You are not authorized to perform this action" });
    }
    next();
  };
};
