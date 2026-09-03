// Minimal static file server for the demo, so no dependency is needed.
// Serves demo/ and dist/, so the demo can load the locally built library.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { extname, join, normalize, resolve, sep } from "node:path";

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

// Only demo/ and dist/ are public, the rest of the repo is not
function isServed(file) {
  return servedDirs.some((dir) => {
    const base = join(root, dir);
    return file === base || file.startsWith(base + sep);
  });
}

// Map a request path onto a file, or return null when it is out of bounds.
// Both the requested path and the file it resolves to are checked, so
// neither "../" nor a symlink can reach outside the served directories.
async function resolveFile(pathname) {
  let file;
  try {
    file = join(root, normalize(decodeURIComponent(pathname)));
  } catch {
    return null; // malformed percent-encoding
  }

  if (!isServed(file)) {
    return null;
  }

  const stats = await stat(file);
  const real = await realpath(
    stats.isDirectory() ? join(file, "index.html") : file
  );

  return isServed(real) ? real : null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");

  let file;
  try {
    file = await resolveFile(pathname);
  } catch {
    res.writeHead(404).end("Not found");
    return;
  }

  if (!file) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  res.writeHead(200, {
    "content-type": mimeTypes[extname(file)] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(res);
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
