// Minimal static file server for the demo, so no dependency is needed.
// Serves demo/ and dist/, so the demo can load the locally built library.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const servedDirs = ["demo", "dist"];
const port = Number(process.env.PORT) || 8080;

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ts": "text/plain",
};

const isServed = (file) =>
  servedDirs.some((dir) => file.startsWith(join(root, dir) + "/"));

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  let file = join(root, normalize(decodeURIComponent(pathname)));

  try {
    if ((await stat(file)).isDirectory()) {
      file = join(file, "index.html");
    }
    // Only demo/ and dist/ are public, the rest of the repo is not
    if (!isServed(file)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    const contentType = mimeTypes[extname(file)] ?? "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

server.listen(port, () => {
  const url = `http://localhost:${port}/demo/`;
  console.log(`Serving demo on ${url}`);

  if (process.env.NO_OPEN) {
    return;
  }

  const opener =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  spawn(opener, [url], {
    stdio: "ignore",
    detached: true,
    shell: process.platform === "win32",
  }).unref();
});
