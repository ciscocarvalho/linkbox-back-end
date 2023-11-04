import "dotenv/config";
import app from "./src/app";
import connectToMongoDB from "./src/database";

const PORT = process.env.PORT || 3000;

async function startDB() {
  await connectToMongoDB();
  console.log("MongoDB connected successfully");
}

export function startServer() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}

startDB();
startServer();
