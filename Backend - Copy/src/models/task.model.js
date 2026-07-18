import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({


    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },

    color: {
        type: String,
        default: "#ffffff",
    },




}, { timestamps: true })

export const Task = mongoose.model("Task", taskSchema)