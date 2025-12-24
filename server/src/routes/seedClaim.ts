import { Pool } from "pg";

// ⚠️ Use the SAME config as db.ts
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "app",
  password: "app",
  database: "feed",
});

async function seedClaims() {
  try {
    console.log("🌱 Seeding health & dental claim events...");

    // Optional: clean existing data (comment out if not needed)
    await pool.query(`TRUNCATE TABLE activity_events`);

    const events = [
      {
        user_id: "member_101",
        type: "CLAIM_SUBMITTED",
        message: "Dental claim submitted for $120",
      },
      {
        user_id: "member_101",
        type: "UNDER_REVIEW",
        message: "Claim is under review by benefits team",
      },
      {
        user_id: "member_101",
        type: "APPROVED",
        message: "Claim approved – coverage applied",
      },
      {
        user_id: "member_101",
        type: "PAID",
        message: "Payment of $96 issued to member",
      },
      {
        user_id: "member_202",
        type: "CLAIM_SUBMITTED",
        message: "Health claim submitted for physiotherapy session",
      },
      {
        user_id: "member_202",
        type: "UNDER_REVIEW",
        message: "Additional documents requested for claim",
      },
    ];

    for (const e of events) {
      await pool.query(
        `
        INSERT INTO activity_events (user_id, type, message)
        VALUES ($1, $2, $3)
        `,
        [e.user_id, e.type, e.message]
      );
    }

    console.log(`✅ Inserted ${events.length} claim events`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await pool.end();
    console.log("🔌 Database connection closed");
  }
}

seedClaims();
