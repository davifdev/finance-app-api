import jwt from "jsonwebtoken";

export const auth = (request, response, next) => {
  try {
    const accessToken = request.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    );

    if (!payload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    request.userId = payload.userId;
    next();
  } catch (error) {
    console.error(error);
    return response.status(401).json({ message: "Unauthorized" });
  }
};
