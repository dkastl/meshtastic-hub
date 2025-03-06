import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Use environment variable or default to 'info'
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/meshtastic-hub.log' })
    ],
});

export default logger;
