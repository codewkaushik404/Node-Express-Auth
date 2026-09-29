import type {JwtPayload} from "./AuthPayload.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export {};