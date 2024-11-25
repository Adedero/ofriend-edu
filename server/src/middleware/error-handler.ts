import { type Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../config/winston.config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error handler :' , err.message);
    res.status(500).json({ message: `Server Error: ${err.message}` });
    return;
  }
  logger.error(err.message);
  res.status(500).json({ message: 'Something happened and we\'re working on it.\nPlease, try again later.' });
  return;
};

export default errorHandler;
