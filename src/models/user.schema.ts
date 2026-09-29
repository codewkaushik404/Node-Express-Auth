import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username should be unique"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email should be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verified: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("users", userSchema);

//if u want ur obj to have methods along with fields and their types use hydratedDocument 
export type User = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof userSchema>>;

export default userModel;
