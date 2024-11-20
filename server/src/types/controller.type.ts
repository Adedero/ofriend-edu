import type { Response, Request, NextFunction } from "express";

export interface Middleware {
  (req: Request, res: Response, next: NextFunction): void | Promise<void>;
}

export interface Controller<T> {
  path: string;
  method: string;
  handler: (req: Request, res: Response<T>) => Promise<T>;
  middleware?: Middleware[];
}
