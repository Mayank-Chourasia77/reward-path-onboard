import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse incoming JSON

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Sign Up Route (create a user)
app.post("/api/signup", async (req, res) => {
  const { email, phone, passwordHash } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "User creation failed" });
  }
});

// Save Profile Route
app.post("/api/signup", async (req, res) => {
  const { email, phone, passwordHash } = req.body;

  console.log("➡️ Received signup request:", { email, phone, passwordHash });

  try {
    const user = await prisma.user.create({
      data: {
        email: email || null,             // fallback to null if undefined
        phone: phone || null,             // fallback to null if undefined
        passwordHash: passwordHash || null,
      },
    });

    console.log("✅ User created:", user);
    res.status(201).json(user);
  } catch (error: any) {
    console.error("❌ Error in /api/signup:", error.message);
    res.status(500).json({ error: error.message || "User creation failed" });
  }
});

app.listen(4000, () => {
  console.log("✅ Backend is running at http://localhost:4000");
});

