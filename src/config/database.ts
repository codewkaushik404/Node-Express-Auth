import config from "./config.js";
import mongoose from "mongoose";

async function connectToDB(){
    const connectionObj = await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to database",connectionObj.connection.name);
}

export default connectToDB;