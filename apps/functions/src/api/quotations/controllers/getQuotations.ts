import { Response, Request, NextFunction } from "express";

import { fetchQuotations } from "../../../_firebase/collections";

export const getQuotations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("「Get quotations data」Initialize");

  try {
    const quotations = await fetchQuotations();

    res.json(quotations);
  } catch (e) {
    console.error(e);
  }
};
