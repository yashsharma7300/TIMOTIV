import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.config.js";


connectDB()

    .then(() => {

        app.on("error", (error) => {
            console.log("error while running on port: ", error)
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port : ${process.env.PORT}`)
        })
    })

    .catch((error) => {
        console.log("mongo db connection failed index.js :", error)
    });

