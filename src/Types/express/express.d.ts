declare namespace Express {
   export interface Request {
      session?: {
         authenticated: boolean,
         userId?: string,
         user?: import("../../Model/User").IUser
      }
   }
}
