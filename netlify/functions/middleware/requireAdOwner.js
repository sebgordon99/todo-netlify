import Ad from "../models/ad.js";

export async function requireAdOwner(req, res, next) {
  try {
    const adId = Number(req.params.id);
    if (!Number.isFinite(adId)) {
      return res.status(400).json({ error: "Invalid ad id" });
    }

    const ad = await Ad.findByPk(adId);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    if (Number(ad.tutor_id) !== Number(req.user.tutor_id)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    req.ad = ad; // optional
    return next();
  } catch (err) {
    console.error("requireAdOwner failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
