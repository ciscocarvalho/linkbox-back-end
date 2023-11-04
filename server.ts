import "dotenv/config";
import app from "./src/app";
import connectToMongoDB from "./src/database";

const PORT = process.env.PORT || 3000;

async function startDB() {
  await connectToMongoDB();
  console.log("MongoDB connected successfully");
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}

async function main() {
  await startDB();
  startServer();
}

main();
