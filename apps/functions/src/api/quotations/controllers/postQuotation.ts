import { NextFunction, Request, Response } from "express";

import { addQuotation } from "../../../_firebase/collections";
import { defaultFirestoreProps } from "../../../utils";

const { assignCreateProps } = defaultFirestoreProps();

export const postQuotation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: quotation } = req;

  console.log("「Add quotation」Initialize", quotation, {
    params: req.params,
    body: req.body,
  });

  try {
    await addQuotation(assignCreateProps(quotation));
    res.sendStatus(200).end();
  } catch (e) {
    console.error(e);
  }
};
