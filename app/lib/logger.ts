import pino from 'pino';
import micromatch from 'micromatch';

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
);

export const loggerFactory = ({ module, subModule }: { module: string, subModule?: string }) => {
  let childLogger = logger.child({ module, subModule });

  childLogger.level = (
    process.env.APP_DEBUG
    && process.env.APP_DEBUG.length
    && micromatch.isMatch(module, process.env.APP_DEBUG.split(" "))
   )
   ? "debug"
   :  process.env.LOG_LEVEL ?? 'info';

  return childLogger;
}
