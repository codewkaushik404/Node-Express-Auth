import type mongoose from "mongoose"

export type JwtPayload = {
    id : mongoose.Types.ObjectId,
    sessionId: mongoose.Types.ObjectId 
}