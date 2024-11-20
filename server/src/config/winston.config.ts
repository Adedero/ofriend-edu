import { config } from 'dotenv';
import winston from 'winston';
import fs from 'fs';
import path from 'node:path';
import 'winston-daily-rotate-file';

config();

const errorLogDirectory = path.resolve('logs', 'error');
const infoLogDirectory = path.resolve('logs', 'info');

const isProduction = process.env.NODE_ENV === 'production';

// Ensure log directories exist
if (!fs.existsSync(errorLogDirectory)) {
  fs.mkdirSync(errorLogDirectory, { recursive: true });
}
if (!fs.existsSync(infoLogDirectory)) {
  fs.mkdirSync(infoLogDirectory, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, service }) => {
      return `[${timestamp}] ${level.toUpperCase()}: [${service}] ${message}`;
    })
  ),
  defaultMeta: { service: 'site-service' },
  transports: [
    // Daily rotating error log file
    new winston.transports.DailyRotateFile({
      dirname: errorLogDirectory,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'error',
    }),

    // Daily rotating info log file
    new winston.transports.DailyRotateFile({
      dirname: infoLogDirectory,
      filename: 'info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'info',
    }),

    // Console transport for development (logs both info and error in colorized format)
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  ],
});

export default logger;
