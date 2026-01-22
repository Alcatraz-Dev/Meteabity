#!/usr/bin/env node

// Run this script to seed the database with demo data
// Usage: node seed-db.js

const { ConvexHttpClient } = require("convex/browser");

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL);

async function seedDatabase() {
  try {
    console.log("Seeding database with demo data...");
    const result = await client.mutation("seed:seedData", {});
    console.log("✅", result);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedDatabase();