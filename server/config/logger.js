const Winston = require('winston');
const { format, transports } = require('winston');
const { combine, timestamp, colorize, printf } = format;

var logger;

const logFormat = printf((info) => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

(function createLogger() {

    logger = Winston.createLogger({
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat,
        ),

        transports: [
            new transports.Console({
                format: combine(
                    colorize(),
                    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    logFormat,
                )
            }),

            new transports.File({
                filename: 'logs/combined.logs',
                level: 'info',
            }),

            new transports.File({
                filename: 'logs/errors.logs',
                level: 'error'
            })]
    });

    Winston.addColors({
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        debug: 'green'
    });
})();

module.exports = logger;