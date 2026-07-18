import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./src/routes/user.routes.js";

const app = express();
console.log("in app.js app started");

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("backend is running : app.js");
});

app.use("/api", router);

// global error-handling middleware
app.use((err, req, res, next) => {
    console.error("Backend Error Details:", err);
    console.log(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export default app;

