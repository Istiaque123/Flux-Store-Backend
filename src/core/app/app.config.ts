// ! src/core/app/app.config.ts

import cors from "cors";

import type { Application } from "express";
import Express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../../config";

// create express applicaion
export function createApp(): Application {
  const app: Application = Express();

  // ! Parse JSON and urlencoded first — increased limits to prevent PayloadTooLargeError
  app.use(Express.json({ limit: "45mb" }));

  app.use(
    Express.urlencoded({
      extended: true,
      limit: "45mb", // added safe limit
      parameterLimit: 850000, // prevent parameter explosion
    })
  );

  // File uploads — also increase file size limit (important when sending attachments)
  app.use(
    fileUpload({
      limits: {
        fileSize: 45 * 1024 * 1024, // 15 MB max per file (adjust if needed: 15mb → 50 * 1024 * 1024)
      },
      abortOnLimit: true,
      responseOnLimit: "File size too large!",
    })
  );

  // CORS
  app.use(cors({ origin: "*" }));

  app.get("/", (req: Express.Request, res: Express.Response) => [
      res.send("FluxStor server running"),
    ]);

  // Static files

  const __filename: string = fileURLToPath(import.meta.url);
  const __dirname: string = path.dirname(__filename);


  const publicDir: string = env.PUBLIC_DIR ;
  app.use(Express.static(path.join(__dirname, "..", "..", "..", publicDir)));

  

  return app;
}
