// ! src/core/bootstrap.ts
import type { Application } from "express";
import {
  applyCoreMiddleWare,
  createApp,
  initializeDatabase,
  initializeTablesMigration
} from "./app";
import { env } from "../config";
import { logger } from "../utils";
import type { Request, Response } from "express";
import { getTableDefinitions } from "./tables";
import { createRouterManager, registerAllRoutes } from "./routes";
import { errorMiddleware } from "../middlewares";
import { HTTP_STATUS } from "../common";

export const bootstrap = async (): Promise<void> => {
  try {

    // ? Initialize DB connection and enable extensions
    await initializeDatabase();

    // ? Run migrations (pass table definitions)
    const tableDefination = getTableDefinitions();
    await initializeTablesMigration(tableDefination);


    // ? Create and configure app
    let app: Application = createApp();

    

    // ! add response middleware
    app = applyCoreMiddleWare(app);


    // ? initilize routes 
    const routerManager = createRouterManager(app);
    registerAllRoutes(routerManager);
    routerManager.applyRoutes();






    // ! Catch-all for unmatched routes (404)
    app.use((req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({     // ← use 404, not 502
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        status: HTTP_STATUS.NOT_FOUND,
        data: null,
      });
    });

    // ? Error middleware (must be last)
    app.use(errorMiddleware);






    // ? Start server
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Bootstrap failed: ${error}`);
    process.exit(1);  // Exit on failure
  }
};
