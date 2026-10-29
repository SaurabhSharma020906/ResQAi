const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://resqai:Saurabh2906@resqai.h6lvhv2.mongodb.net/?retryWrites=true&w=majority&appName=ResQAI";

async function main() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting...");
    await client.connect();
    console.log("✅ Connected!");

    const admin = client.db("admin");
    const result = await admin.command({ ping: 1 });
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();