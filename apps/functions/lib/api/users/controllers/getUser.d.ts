import { Response, Request, NextFunction } from "express";
interface Params {
  userId: string;
}
export declare const getUser: (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => Promise<void>;
export {};
//# sourceMappingURL=getUser.d.ts.map
