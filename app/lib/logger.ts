import pino from 'pino';
import chalk from 'chalk';

export const logger = pino(
    {
      level: process.env.PINO_LOG_LEVEL || 'info',
      timestamp: pino.stdTimeFunctions.isoTime
    },
    //transport
  );

export const loggerFactory = ({module, level}: {module: string, level: string | undefined}) => {
  let childLogger = logger.child({module});
  if(level)
    childLogger.level = level;
  return childLogger;
}
/*
  const logger = pino(pino.destination({
    sync: true // Asynchronous logging
  }))
*/
export const chalkInfo = chalk.bold.blue, chalkPass = chalk.bold.green, chalkFail = chalk.bold.red, chalkImportant = chalk.bold, chalkWarn = chalk.yellow;

export {
    //chalkInfo, chalkPass, chalkFail, chalkImportant, chalkWarn, chalk
}