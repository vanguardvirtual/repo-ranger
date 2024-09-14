import { NextFunction, Request, Response } from 'express';

export interface asyncPropsFunction {
  (req: Request, res: Response, next: NextFunction): any;
}

export interface IResponse<T> {
  status: number;
  message: string;
  data: T | any;
  error: string;
  success: boolean;
}
