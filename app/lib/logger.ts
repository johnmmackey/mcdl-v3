//import config from '@/loggerConfig.json'

import winston from 'winston';
import micromatch from 'micromatch';

let baseLogLevel = 'debug';
let debugModulePatterns: string[] = [];

const loggerFactory = ({ module, subModule }: { module: string, subModule?: string }) => {
  const label = subModule ? `${module}:${subModule}` : `${module}`;

  return winston.loggers.get(label, {
    level: micromatch([label], debugModulePatterns).length ? 'debug' : baseLogLevel,
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.label({ label }),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level}]: [${info.label}]: ${info.message}`;
      })
    )
  });
}

const logger = loggerFactory({module: 'default'});

const setBaseLevel = (level: string) => {
  // have to set the level on any existing loggers and save this list in case new loggers are created
  const loggerList = Array.from(winston.loggers.loggers.keys());
  loggerList.forEach(m => winston.loggers.get(m).level = level);
  baseLogLevel = level;
}

const setDebugModules = (patterns: string[]) => {
  // have to set the level on any existing loggers and save this list in case new loggers are created
  const loggerList = Array.from(winston.loggers.loggers.keys());
  patterns.forEach(pat => {
    micromatch(loggerList, pat).forEach(m => winston.loggers.get(m).level = 'debug');
  });
  debugModulePatterns = patterns;
}

export { logger, loggerFactory, setBaseLevel, setDebugModules };
