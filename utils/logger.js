const winston = require('winston');
require('winston-daily-rotate-file'); // Import log rotation module
const path = require('path');

// Define log directory
const logDirectory = path.join(__dirname, '..', 'logs');

// Custom log format for FILE (includes timestamp, level, and message)
const fileLogFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configure log rotation
const transport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, 'debug-%DATE%.log'), // Creates logs like "debug-2025-02-12.log"
    datePattern: 'YYYY-MM-DD', // Rotate logs daily
    zippedArchive: true, // Compress old logs to save space
    maxSize: '10m', // Each file is max 10MB before rotating
    maxFiles: '14d', // Keep logs for 14 days, delete older ones automatically
    format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }),
        fileLogFormat
    ),
});

// Create a Winston logger instance with rotation
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }),
        fileLogFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        transport, // Replaces static file logging with rotation
    ],
});

// Console Logging 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.printf(({ level, message }) => {
                return `${level}: ${message}`;
            })
        )
    }));
}

module.exports = logger;
