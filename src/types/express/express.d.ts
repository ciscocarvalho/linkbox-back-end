declare namespace Express {
   export interface Request {
      session?: {
         authenticated: boolean,
         userId?: string,
         user?: import("../../models/User").IUser
      }
   }
}
