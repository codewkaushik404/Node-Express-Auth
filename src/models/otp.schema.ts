import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email-ID is required"]
    },
    otpHash: {
        type: String,
        required: [true, "Otp Hash is required"]
    }
}, {
    timestamps: true
});

export type Otp = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof otpSchema>>;

const otpModel = mongoose.model("otps", otpSchema);
export default otpModel;