import User from "../models/user.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123!";

    //Ensure only one admin exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "Admin",
        email: adminEmail,
        password:adminPassword,
      //  password: hashedPassword,
        //   //agr koi problem aii pasword ki to yaha par try karna adminPassword
        role: "admin",
      });

      console.log("✅ Default admin created:", adminEmail);
    } else {
      console.log("ℹ️ Admin already exists",existingAdmin.email);
    }
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  }
};

export default seedAdmin;
