import { Response, Request, NextFunction } from "express";
import { Quotation } from "../../../globalTypes";
type Params = {
    quotationId: string;
};
export declare const putQuotation: (req: Request<Params, unknown, Quotation, unknown>, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=putQuotation.d.ts.map