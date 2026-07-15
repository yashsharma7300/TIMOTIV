import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
)

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false,
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh tokens."
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (
        [username, email, password].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existedUser = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail },
        ],
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "Username or email already exists."
        );
    }

    const user = await User.create({
        displayName: normalizedUsername,
        username: normalizedUsername,
        email: normalizedEmail,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "User registration failed. Please try again."
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully."
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(
            400,
            "Username or email is required."
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "Password is required."
        );
    }

    const queryConditions = [];
    if (username) queryConditions.push({ username: username.trim().toLowerCase() });
    if (email) queryConditions.push({ email: email.trim().toLowerCase() });

    const user = await User.findOne({ $or: queryConditions });

    if (!user) {
        throw new ApiError(
            404,
            "User does not exist."
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid credentials."
        );
    }

    const {
        accessToken,
        refreshToken,
    } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully."
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully."
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies.refreshToken ||
        req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Refresh token not found."
        );
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(
            401,
            "Invalid or expired refresh token."
        );
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(
            401,
            "Invalid refresh token."
        );
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(
            401,
            "Refresh token has expired or has already been used."
        );
    }

    const {
        accessToken,
        refreshToken,
    } = await generateAccessAndRefreshTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken,
                },
                "Access token refreshed successfully."
            )
        );
});

const googleLogin = asyncHandler(async (req, res) => {

    const { credential } = req.body;

    if (!credential) {
        throw new ApiError(400, "Google credential is required");
    }

    const ticket = await googleClient.verifyIdToken(
        {
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        }
    )
    const payload = ticket.getPayload();

    const {
        sub: googleId,
        email,
        name,
        picture,
        email_verified,
    } = payload


    if (!email || !email_verified) {
        throw new ApiError(400, "Email not verified");
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({ googleId });

    if (!user) {
        user = await User.findOne({ email: normalizedEmail });

        if (user) {
            user.googleId = googleId;
            user.isEmailVerified = true;
            await user.save({ validateBeforeSave: false });
        }
    }

    if (!user) {
        const username = `${normalizedEmail.split("@")[0]}_${Date.now()}`;
        user = await User.create({
            email: normalizedEmail,
            displayName: name,
            avatar: {
                url: picture,
            },
            googleId,
            username,
            authProvider: "google",
            isEmailVerified: true,
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const googleLoginUser = await User.findById(user._id).select("-password -refreshToken");

    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: googleLoginUser,
                    accessToken,
                    refreshToken,
                },
                "Google login successful"
            )
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    googleLogin,
};




// later see issue in LOGIN

// const queryConditions = [];
// if (username) queryConditions.push({ username: username.toLowerCase().trim() });
// if (email) queryConditions.push({ email: email.toLowerCase().trim() });

// const user = await User.findOne({ $or: queryConditions });
