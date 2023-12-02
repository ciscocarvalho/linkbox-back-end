declare namespace Express {
   export interface Request {
      session?: {
         authenticated: boolean,
         userId?: string,
         user?: import("../../models/User").IUser
      }
   }
   export interface Response {
      sendData: (data: object, statusCode?: number) => void;
      sendErrors: (errors: import("../../utils/ResponseError").ResponseError[], statusCode?: number) => void;
      handleError: (error: any) => void;
   }
}
