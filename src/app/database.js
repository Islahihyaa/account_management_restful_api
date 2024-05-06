import { PrismaClient } from "@prisma/client";
import { logger } from "./logging.js";

export const prismaCLient = new PrismaClient({
    log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
});

prismaCLient.$on('error', (e) => {
    logger.error(e);
})

prismaCLient.$on('warn', (e) => {
    logger.warn(e);
})

prismaCLient.$on('info', (e) => {
    logger.info(e);
})

prismaCLient.$on('info', (e) => {
    logger.info(e);
})

