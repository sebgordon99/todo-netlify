import bcrypt from "bcryptjs";
import Tutor from "../models/Tutor.js";

// Very simple cookie session (MVP)
// If you already have a session system, plug into that instead.
function setAuthCookie(res, tutor) {
  // For MVP: store tutor_id in a cookie
  // In production you’d use signed cookies / JWT / session store.
  res.cookie("tutor_id", String(tutor.tutor_id), {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true on HTTPS deployments
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: "name, email, username, password are required" });
    }

    // Check uniqueness
    const existingEmail = await Tutor.findOne({ where: { email } });
    if (existingEmail) return res.status(409).json({ error: "Email already in use" });

    const existingUsername = await Tutor.findOne({ where: { username } });
    if (existingUsername) return res.status(409).json({ error: "Username already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const tutor = await Tutor.create({
      name,
      email,
      username,
      password: hashed,
      account_status: "active",
      avatar_url: null,
      phone: null,
    });

    // Auto-login after register (nice for demo)
    setAuthCookie(res, tutor);

    return res.status(201).json({
      tutor_id: tutor.tutor_id,
      name: tutor.name,
      email: tutor.email,
      username: tutor.username,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "emailOrUsername and password are required" });
    }

    const tutor = await Tutor.findOne({
      where: {
        // simple OR lookup
        ...(emailOrUsername.includes("@")
          ? { email: emailOrUsername }
          : { username: emailOrUsername }),
      },
    });

    if (!tutor) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, tutor.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, tutor);

    return res.json({
      tutor_id: tutor.tutor_id,
      name: tutor.name,
      email: tutor.email,
      username: tutor.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const tutorId = req.cookies?.tutor_id;
    if (!tutorId) return res.status(401).json({ error: "Not logged in" });

    const tutor = await Tutor.findByPk(tutorId, {
      attributes: ["tutor_id", "name", "email", "username"],
    });
    if (!tutor) return res.status(401).json({ error: "Not logged in" });

    return res.json(tutor);
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("tutor_id");
  return res.json({ ok: true });
};
