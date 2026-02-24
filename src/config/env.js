require('dotenv').config();

// 1. Lists every variable the app NEEDS to survive
const requiredVars = ['PORT', 'MONGODB_URI']; 

// 2. The Check: Loops through and verify they exist
requiredVars.forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing Environment Variable: ${name}`);
    process.exit(1); // Kills the app immediately if a variable is missing
  }
});

// 3. Exports the "Safe" variables
module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGODB_URI
};
