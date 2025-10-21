import { Response, Request, NextFunction } from "express";

export const getAssistance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ message: "En desarrollo!!!" });
  } catch (e) {
    console.error(e);
  }
};
