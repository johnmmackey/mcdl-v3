import winston from 'winston';
import micromatch from 'micromatch';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ]
});

export const loggerFactory = ({ module, subModule }: { module: string, subModule?: string }) => {
  const mlogger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
    ],
    level: (
      process.env.APP_DEBUG
      && process.env.APP_DEBUG.length
      && micromatch.isMatch(module, process.env.APP_DEBUG.split(" "))
    )
      ? "debug"
      : process.env.LOG_LEVEL ?? 'info'
  });
  return mlogger;
}

