import winston, {format} from "winston";

const customFormat = format.printf(({level, message, timestamp}) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

export const Logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat,
        winston.format.colorize({all: true})
    ),
})