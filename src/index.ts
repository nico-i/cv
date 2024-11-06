import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
const port = process.env.PORT || 3000;

const staticFolder =
  process.env.STATIC_FOLDER || path.join(__dirname, "../public");

app.use(express.static(staticFolder));

app.get("/", (_: Request, res: Response) => {
  res.sendFile(path.join(staticFolder, " /index.html"));
});

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Tina CMS: http://localhost:${port}`);
  console.log(`[server]: GQL console: http://localhost:${port}#/graphql `);
  console.log(`[server]: GQL API: http://localhost:4001/graphql `);
});
