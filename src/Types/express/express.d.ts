declare namespace Express {
   export interface Request {
      session?: {
         authenticated: boolean,
         userId?: string
      }
   }
}
