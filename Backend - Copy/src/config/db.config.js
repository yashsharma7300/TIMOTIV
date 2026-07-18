import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {

    try {

        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME
        });

        console.log(`in config/db.js DB connection instance : , ${connectionInstance}`)
        console.log("MONGODB CONNECTED !! DB HOST:", connectionInstance.connection.host)

    } catch (error) {

        console.log("in config/db.js error : ", error)
        process.exit(1);

    }
};

export default connectDB;