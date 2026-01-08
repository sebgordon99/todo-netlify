import sequelize from "../config/database.js";
import Tutor from "../models/Tutor.js";
import Ad from "../models/ad.js";
import Availability from "../models/Availability.js";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    // Clear existing data (DEV ONLY)
    await Availability.destroy({ where: {} });
    await Ad.destroy({ where: {} });
    await Tutor.destroy({ where: {} });

    // ---- Tutors ----
    const tutors = await Tutor.bulkCreate([
      {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        username: "sarahm",
        password: "password",
        location_id: 1,
      },
      {
        name: "James Lee",
        email: "james@example.com",
        username: "jamesl",
        password: "password",
        location_id: 1,
      },
      {
        name: "Emily Chen",
        email: "emily@example.com",
        username: "emilyc",
        password: "password",
        location_id: 1,
      },
    ], { returning: true });

    // ---- Ads ----
    const adsData = [];
    const instruments = [1, 2, 3]; // instrument_ids
    let years = 3;

    for (let i = 0; i < 12; i++) {
      adsData.push({
        tutor_id: tutors[i % tutors.length].tutor_id,
        location_id: 1,
        instrument_id: instruments[i % instruments.length],
        ad_description: `Professional music tutor with ${years++} years experience.`,
        years_experience: years,
        hourly_rate: 50 + i * 5,
        img_url: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600",
      });
    }

    const ads = await Ad.bulkCreate(adsData, { returning: true });

    // ---- Availability ----
    const availabilities = [];

    ads.forEach((ad) => {
      for (let i = 0; i < 3; i++) {
        const start = new Date();
        start.setDate(start.getDate() + i + 1);
        start.setHours(18 + i, 0, 0, 0);

        const end = new Date(start);
        end.setHours(start.getHours() + 1);

        availabilities.push({
          ad_id: ad.ad_id,
          user_id: 1,              // demo user
          start_time: start,
          end_time: end,
          is_booked: false,
          user_capacity: 1,
        });
      }
    });

    await Availability.bulkCreate(availabilities);

    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
