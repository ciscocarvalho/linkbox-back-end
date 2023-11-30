export const __prod__ = process.env.NODE_ENV === "production";
export const SECRET = process.env.SECRET!;
export const ROUNDS = parseInt(process.env.ROUNDS!);
export const DB_URL = process.env.DB_URL!;
export const PORT = process.env.PORT || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const FOLDER_SEPARATOR = "/";
