import mongoose from "mongoose"

const FocusSessionSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    mode: {
        type: String,
        enum: ["countdown", "stopwatch"],
        required: true,
    },

    durationInMinutes: {
        type: Number,
        required: true,
        min: 0,
    },

    isCompleted: {
        type: Boolean,
        default: false,
    },

    startedAt: {
        type: Date,
        required: true
    },

    endedAt: {
        type: Date,

    }




}, { timestamps: true });

export const FocusSession = mongoose.model("FocusSession", FocusSessionSchema);