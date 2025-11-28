import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// import User from "./models/User.js";
// import bcrypt from "bcryptjs";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // React dev servers
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// const createInitialAdmin = async () => {
//   try {
//     const usersCount = await User.countDocuments();

//     if (usersCount === 0) {
//       const hashedPassword = await bcrypt.hash("Admin@123", 10);

//       const adminUser = new User({
//         name: "Super Admin",
//         email: "admin@example.com",
//         password: hashedPassword,
//         role: "admin", // Make sure your model supports this
//       });

//       await adminUser.save();

//       console.log("Initial admin created successfully!");
//       console.log("Email: admin@example.com");
//       console.log("Password: Admin@123");
//     }
//   } catch (err) {
//     console.log("Error creating initial admin:", err);
//   }
// };


connectDB();


// connectDB().then(createInitialAdmin);

//test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connection OK" });
});



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
