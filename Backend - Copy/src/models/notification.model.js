import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({


    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    type: {
        type: String,

        enum: ["follow", "achievement", "system"],
        required: true,
    },


    message: {
        type: String,
        required: true,
    },


    isRead: {
        type: Boolean,
        default: false,
    },




}, { timestamps: true });


export const Notification = mongoose.model("Notification", notificationSchema);