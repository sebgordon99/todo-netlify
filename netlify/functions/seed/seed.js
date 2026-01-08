import sequelize from "../config/database.js";

import Location from "../models/Location.js";
import Instrument from "../models/Instrument.js";
import Tutor from "../models/Tutor.js";
import Ad from "../models/ad.js";
import Availability from "../models/Availability.js";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    await sequelize.authenticate();

    // ⚠️ DEV ONLY
    await sequelize.sync({ force: true });

    // -------------------
    // Locations
    // -------------------
    const [melbourne] = await Location.bulkCreate([
      { location_name: "Melbourne CBD" },
      { location_name: "Carlton" },
      { location_name: "Brunswick" },
    ]);

    // -------------------
    // Instruments
    // -------------------
    const [piano, guitar, violin] = await Instrument.bulkCreate([
      { instrument_name: "Piano" },
      { instrument_name: "Guitar" },
      { instrument_name: "Violin" },
    ]);

    // -------------------
    // Tutor
    // -------------------
    const tutor = await Tutor.create({
      name: "Sarah Mitchell",
      location_id: melbourne.location_id,
    });

    // -------------------
    // Ad
    // -------------------
    const ad = await Ad.create({
      tutor_id: tutor.tutor_id,
      location_id: melbourne.location_id,
      instrument_id: piano.instrument_id,
      ad_description:
        "Experienced piano teacher specialising in beginners and adults.",
      years_experience: 12,
      hourly_rate: 65,
      img_url:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600",
    });

    // -------------------
    // Availability slots
    // -------------------
    await Availability.bulkCreate([
      {
        ad_id: ad.ad_id,
        user_id: tutor.tutor_id,
        start_time: "2026-01-10T10:00:00",
        end_time: "2026-01-10T11:00:00",
        is_booked: false,
        user_capacity: 1,
      },
      {
        ad_id: ad.ad_id,
        user_id: tutor.tutor_id,
        start_time: "2026-01-11T14:00:00",
        end_time: "2026-01-11T15:00:00",
        is_booked: false,
        user_capacity: 1,
      },
    ]);

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
