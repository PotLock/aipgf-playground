import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { agent, provider } from "./schema"; // Import your schema
import { eq } from "drizzle-orm";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/drizzle" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  await insertDemoData(db);

  process.exit(0);
};

const insertDemoData = async (db: any) => {
  console.log("⏳ Checking for existing demo data...");

  try {
    // Check if demo models already exist
    const existingModels = await db
      .select()
      .from(provider)
      .where(eq(provider.id, "ae5e2dd9-fc5b-4a50-82d3-6cf17181e76c"));

    if (existingModels.length > 0) {
      console.log("✅ Demo models already exist. Skipping demo data insertion.");
      return;
    }

    // Insert demo models
    const demoModels = [
      {
        id: "ae5e2dd9-fc5b-4a50-82d3-6cf17181e76c",
        userId: "a6064c03-c7b2-4a2f-8447-33ee42732a92",
        modelName: "test",
        apiId: "https://www.youtube.com/watch?v=fq0Lhg3F8TI",
        apiToken: "test",
      },
    ];

    await db.insert(provider).values(demoModels);

    // Insert demo agents
    // const demoAgents = [
    //   {
    //     id: "1",
    //     name: "Demo Agent 1",
    //     description: "This is a demo agent",
    //     prompt: "Hello, I am Demo Agent 1",
    //     intro: "Welcome to Demo Agent 1",
    //     model: "ae5e2dd9-fc5b-4a50-82d3-6cf17181e76c",
    //     provider: "ae5e2dd9-fc5b-4a50-82d3-6cf17181e76c",
    //     userId: "a6064c03-c7b2-4a2f-8447-33ee42732a92",
    //     createdAt: new Date(),
    //     suggestedActions: [],
    //   },
    // ];

    // await db.insert(agent).values(demoAgents);

    console.log("✅ Demo data inserted successfully");
  } catch (error) {
    console.error("❌ Failed to insert demo data");
    console.error(error);
  }
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
