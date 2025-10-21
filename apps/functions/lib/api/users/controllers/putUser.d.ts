import { Response, Request, NextFunction } from "express";
import { User } from "../../../globalTypes";
type Params = {
  userId: string;
};
export declare const putUser: (
  req: Request<Params, unknown, User, unknown>,
  res: Response,
  next: NextFunction
) => Promise<void>;
export {};
//# sourceMappingURL=putUser.d.ts.map
