import { Response, Request, NextFunction } from "express";
interface Params {
    quotationId: string;
}
export declare const getQuotation: (req: Request<Params, unknown, unknown, unknown>, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=getQuotation.d.ts.map