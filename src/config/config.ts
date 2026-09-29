import dotenv from "dotenv";

dotenv.config({quiet: true});

if(!process.env.PORT) throw new Error("Server PORT is not present in env variables");
if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not present in env variables");
if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured in env variables");

const config = {
    PORT : process.env.PORT,
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config;
