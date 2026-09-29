import express from "express";
import config from "./config/config.js";
import connectToDB from "./config/database.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = config.PORT || 8000;

app.use(express.json()); //JSON-data
app.use(express.urlencoded({extended: true})) //Form-data
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true
}));

connectToDB();

app.get("/", (req, res)=> {
    res.send("Server is healthy");
})

app.use("/api/v1/auth", authRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running :${PORT}`);
}) 