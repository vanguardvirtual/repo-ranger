import { NextFunction, Request, Response } from 'express';

export interface asyncPropsFunction {
  (req: Request, res: Response, next: NextFunction): any;
}

export interface IResponse {
  status: number;
  message: string;
  data: any;
  error: string;
  success: boolean;
}
