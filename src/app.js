import express from "express";
import mongoose from "mongoose";
import router from "./routes/router";
import Log from "./logger";
const uri = `mongodb+srv://admin:${process.env.MONGODBPWD}@cluster0.vh7pzqq.mongodb.net/blog?retryWrites=true&w=majority`;
const app = express();

app.listen(process.env.PORT || 5000, () => Log.info("Server is runing....."));
app.use(express.json());
app.use(express.urlencoded());
app.use("/", router);

// connect to mongoose
mongoose.connect(uri).then(() => Log.info("Connected to database")).catch((err) => Log.error(err));
