import mongoose from "mongoose";

const dailyStatsSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },

    totalFocusMinutes: {
        type: Number,
        default: 0,
    },

    totalSessions: {
        type: Number,
        default: 0,
    },

    xpEarned: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

dailyStatsSchema.index(
    { owner: 1, date: 1 },
    { unique: true }
);

export const DailyStats = mongoose.model("DailyStats", dailyStatsSchema);