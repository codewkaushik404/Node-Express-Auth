import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'userModel',
        required: [true, "User ID is required"]
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh Token is required"]
    },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    revoked: {
        type: Boolean,
        default: false
    },
}, 
{
    timestamps: true
});

export type Session = mongoose.InferSchemaType<typeof sessionSchema>& {
    _id: mongoose.Types.ObjectId
};

const sessionModel = mongoose.model("sessions", sessionSchema);
export default sessionModel;