import Todo from "./Todo.js";
import Ad from "./ad";
import Availability from "./availability.js";
import Location from "./location.js";
import Instrument from "./instrument.js";
import User from "./user.js";
import Tutor from "./tutor.js";
import sequelize from "../config/database.js";

// Initialize database connection and sync models
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      await sequelize.authenticate();
      await Ad.sync({ alter: true });
      await Availability.sync({ alter: true });
      await Location.sync({ alter: true });
      await Instrument.sync({ alter: true });
      await User.sync({ alter: true });
      await Tutor.sync({ alter: true });
      await Todo.sync({ alter: true }); // Use alter in production, or migrate properly
      dbInitialized = true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }
}

export default initializeDatabase;

// sync the models here
// had to change the sync order to make sure base tables were created first

// const init = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Successful connection to PostgreSQL Database");

//     // CREATE BASE TABLES FIRST
//     await Location.sync();
//     await Instrument.sync();

//     // THEN TABLES THAT DEPEND ON THEM
//     await User.sync();
//     await Tutor.sync();

//     // THEN ADS & AVAILABILITY
//     await Ad.sync();
//     await Availability.sync();

//     // THEN JOIN TABLES
//     await UserFavouriteTutor.sync();
//     await UserFavouriteLocation.sync();
//     await UserFavouriteInstrument.sync();
//     await UserFavouriteAd.sync();

//     console.log("All models synced");
//   } catch (err) {
//     console.error(err);
//   }
// };

// init();

// // USERS ↔ LOCATIONS
// User.belongsTo(Location, {
//   foreignKey: "location_id",
// });
// Location.hasMany(User, {
//   foreignKey: "location_id",
// });

// // TUTORS ↔ LOCATIONS
// Tutor.belongsTo(Location, {
//   foreignKey: "location_id",
// });
// Location.hasMany(Tutor, {
//   foreignKey: "location_id",
// });

// // TUTORS ↔ ADS
// Tutor.hasMany(Ad, {
//   foreignKey: "tutor_id",
// });
// Ad.belongsTo(Tutor, {
//   foreignKey: "tutor_id",
// });

// // ADS ↔ LOCATIONS
// Ad.belongsTo(Location, {
//   foreignKey: "location_id",
// });
// Location.hasMany(Ad, {
//   foreignKey: "location_id",
// });

// // ADS ↔ INSTRUMENTS
// Ad.belongsTo(Instrument, {
//   foreignKey: "instrument_id",
// });
// Instrument.hasMany(Ad, {
//   foreignKey: "instrument_id",
// });

// // ADS ↔ AVAILABILITY
// Ad.hasMany(Availability, {
//   foreignKey: "ad_id",
// });
// Availability.belongsTo(Ad, {
//   foreignKey: "ad_id",
// });

// // USERS ↔ AVAILABILITY
// User.hasMany(Availability, {
//   foreignKey: "user_id",
// });
// Availability.belongsTo(User, {
//   foreignKey: "user_id",
// });

// // USERS ↔ TUTORS (FAVOURITES)
// User.belongsToMany(Tutor, {
//   through: UserFavouriteTutor,
//   foreignKey: "user_id",
//   otherKey: "tutor_id",
// });

// Tutor.belongsToMany(User, {
//   through: UserFavouriteTutor,
//   foreignKey: "tutor_id",
//   otherKey: "user_id",
// });

// // USERS ↔ LOCATIONS
// User.belongsToMany(Location, {
//   through: UserFavouriteLocation,
//   foreignKey: "user_id",
//   otherKey: "location_id",
// });

// // USERS ↔ INSTRUMENTS
// User.belongsToMany(Instrument, {
//   through: UserFavouriteInstrument,
//   foreignKey: "user_id",
//   otherKey: "instrument_id",
// });

// // USERS ↔ ADS
// User.belongsToMany(Ad, {
//   through: UserFavouriteAd,
//   foreignKey: "user_id",
//   otherKey: "ad_id",
// });

// module.exports = {
//   sequelize,
//   User,
//   Tutor,
//   Ad,
//   Availability,
//   Instrument,
//   Location,
// };
