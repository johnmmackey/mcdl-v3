import pino from 'pino';
import chalk from 'chalk';


const transport = pino.transport({
    targets: [

      {
        target: 'pino-pretty',
        options: {
          sync: true
        }
      },
    ],
    sync: true
  });
  


const logger = pino(
    {
      level: process.env.PINO_LOG_LEVEL || 'debug',
      timestamp: pino.stdTimeFunctions.isoTime
    },
    transport
  );

/*
  const logger = pino(pino.destination({
    sync: true // Asynchronous logging
  }))
*/
const chalkInfo = chalk.bold.blue, chalkPass = chalk.bold.green, chalkFail = chalk.bold.red, chalkImportant = chalk.bold, chalkWarn = chalk.yellow;

export {
    logger,
    chalkInfo, chalkPass, chalkFail, chalkImportant, chalkWarn, chalk
}