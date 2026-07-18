import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.config.js";


connectDB()

    .then(() => {

        app.on("error", (error) => {
            console.log("error while running on port: ", error)
            throw error
        })

        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running on port : ${port}`)
        })
    })

    .catch((error) => {
        console.log("mongo db connection failed index.js :", error)
    });

