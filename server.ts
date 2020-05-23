import "zone.js/dist/zone-node";

import { ngExpressEngine } from "@nguniversal/express-engine";
import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";

import { AppServerModule } from "./src/main.server";
import { APP_BASE_HREF } from "@angular/common";
import { existsSync } from "fs";
import * as xhr2 from "xhr2";

xhr2.prototype._restrictedHeaders = {};

const server = express();
const language = path.basename(__dirname);
const baseHref = language === "en" ? "/" : `/${language}`;
const distFolder = path.join(process.cwd(), "dist/browser", language);

const indexHtml = existsSync(path.join(distFolder, "index.original.html")) ? "index.original.html" : "index";
const port = process.env.PORT || 4000;

server.engine("html", ngExpressEngine({ bootstrap: AppServerModule }));
server.set("view engine", "html");
server.set("views", distFolder);
server.use(cookieParser());

// Example Express Rest API endpoints
// server.get('/api/**', (req, res) => { });
// Serve static files from /browser
server.use(baseHref, express.static(distFolder, { maxAge: "1y", index: false }));
// All regular routes use the Universal engine
server.get("*", (req, res) => {
  const requestInfo = new Date().toISOString() + ` GET: ${req.originalUrl}`;
  console.time(requestInfo);

  res.render(indexHtml,
    { req, providers: [{ provide: APP_BASE_HREF, useValue: baseHref }] },
    (error, html) => {
      if (error) console.log(error);
      res.send(html);
      console.timeEnd(requestInfo);
    });
});
server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});

export * from "./src/main.server";
