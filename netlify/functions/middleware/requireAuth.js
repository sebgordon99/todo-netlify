import jwt from "jsonwebtoken";
import cookie from "cookie";

export function requireAuth(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET is not set" });
    }

    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const payload = jwt.verify(token, secret);
    req.user = payload; // { tutor_id, email, name }
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
