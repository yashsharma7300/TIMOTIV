import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"




const userSchema = new mongoose.Schema({

    displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },



    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },

    password: {
        type: String,
        required:
            function () {
                return this.authProvider === "local";
            },


    },

    avatar: {
        public_id: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/your-cloud/image/upload/default-avatar.png",
        }
    },

    bio: {
        type: String,
        default: "",
        maxlength: 200,
    },

    xp: {
        type: Number,
        default: 0,
    },

    level: {
        type: Number,
        default: 1,
    },

    totalFocusMinutes: {
        type: Number,
        default: 0
    },

    totalSessions: {
        type: Number,
        default: 0,
    },

    totalTasksCompleted: {
        type: Number,
        default: 0,
    },


    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    currentStreak: {
        type: Number,
        default: 0,
    },

    longestStreak: {
        type: Number,
        default: 0,
    }
    ,

    lastActive: {
        type: Date,
        default: Date.now,
    },


    refreshToken: {
        type: String,

    },

    googleId: {
        type: String,
        default: "",
    },





}, { timestamps: true });


userSchema.pre("save", async function (next) {

    if (!this.password || !this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10) // here 10 is salt rund or cost factor , 
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }


    );

};


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(

        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },

    );
};


export const User = mongoose.model("User", userSchema);