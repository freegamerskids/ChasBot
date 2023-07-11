import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf} = format;

const { log_level } = require('../../config.json')

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${level.toUpperCase()}] (${timestamp}): ${message}`;
});

const logger = createLogger({
    level: log_level,
    format: combine(
        timestamp({format:'MM-DD HH:mm:ss'}),
        myFormat
    ),
    transports: [new transports.Console()]
});

const log = {
    'log': function(msg:any,...any_msg:any) {
        logger.info(msg+' '+any_msg.join(' '));
    },
    'warn': function(msg:any,...any_msg:any) {
        logger.warn(msg+' '+any_msg.join(' '));
    },
    'error': function(msg:any,...any_msg:any) {
        logger.error(msg+' '+any_msg.join(' '));
    },
    'verbose': function(msg:any,...any_msg:any) {
        logger.verbose(msg+' '+any_msg.join(' '));
    },
    'debug': function(msg:any,...any_msg:any) {
        logger.debug(msg+' '+any_msg.join(' '));
    },
    'silly': function(msg:any,...any_msg:any) {
        logger.silly(msg+' '+any_msg.join(' '));
    },
}

export default log;