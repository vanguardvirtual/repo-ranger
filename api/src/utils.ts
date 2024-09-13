import { asyncPropsFunction } from '@/types';
import { NextFunction, Request, Response } from 'express';
import bunyan from 'bunyan';
import { IResponse } from './types';

const log = bunyan.createLogger({
  name: 'repo-ranger',
});

export const logger = (type: 'info' | 'error' | 'warn' | 'debug', message: unknown) => {
  log[type](message);
};

export const asyncFn = (fn: asyncPropsFunction) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    logger('error', error);
    next(error);
  }
};

export const resFn = (res: Response, { status, error, data, message, success }: IResponse) => {
  const suc = success !== undefined ? success : true;

  res.status(status).json({
    error,
    data,
    message,
    success: suc,
    status,
  });
};
