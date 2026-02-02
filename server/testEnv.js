import dotenv from "dotenv";

// Load env file
dotenv.config({ path: "./config/config.env" });

// Print env variable
console.log("Stripe Secret Key is:", process.env.STRIPE_SECRET_KEY);
