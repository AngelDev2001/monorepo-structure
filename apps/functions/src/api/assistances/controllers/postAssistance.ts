import { Response, Request, NextFunction } from "express";

export const postAssistance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: assistance } = req;

  console.log("「Add assistance」Initialize", assistance, {
    params: req.params,
    body: req.body,
  });

  try {
    res.json({ message: "En desarrollo!!!" });
  } catch (e) {
    console.error(e);
  }
};
