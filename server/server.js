import dotenv from "dotenv";

dotenv.config();
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./app.js";
import connection from "./config/db.js";

const PORT=process.env.PORT||5000;
const startServer=async()=>{
    await connection();
    
    app.listen(PORT,()=>{
        console.log(`server running on port ${PORT}`);
    });
};

startServer();