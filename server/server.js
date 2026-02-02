import app from './app.js';
import https from 'https';
import fs from 'fs';
import { dbConnection } from "./database/dbconnection.js";
import seedAdmin from "./utils/seedAdmin.js";
import { init } from "./socket.js";

const key = fs.readFileSync('../localhost-key.pem');
const cert = fs.readFileSync('../localhost.pem');
const PORT = process.env.PORT || 5000;

app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get('/', (req, res) => {    
  res.send('🎉 Event Booking API is running successfully');
});

const startServer = async () => {
  try {
    // 1️⃣ Connect to DB
    await dbConnection();
    console.log("Database connected successfully");

    // 2️⃣ Seed admin
    await seedAdmin();
    console.log("Admin seeded successfully");


    // 3️⃣ Start HTTPS server
    const server = https.createServer({ key, cert }, app);

    // attach socket.io
    init(server);



    server.listen(PORT, () => {
      console.log(`Server running on https://localhost:${PORT}`);
    });

  

  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();





