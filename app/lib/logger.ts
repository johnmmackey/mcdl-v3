import pino from 'pino';
import config from '@/loggerConfig.json'

export const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || config.main || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
);

export const loggerFactory = ({ module, subModule }: { module: string, subModule?: string }) => {
  let childLogger = logger.child({ module, subModule });

  if ((<any>config)[module])
    childLogger.level = (<any>config)[module];
  return childLogger;
}

