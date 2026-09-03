// Minimal static file server for the demo, so no dependency is needed.
// Serves demo/ and dist/, so the demo can load the locally built library.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { extname, join, relative, resolve, sep } from "node:path";

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

// The files that may be served, as url path -> file on disk. Requests are
// answered by looking a url up in here, so a request never builds a path
// of its own and cannot reach outside these directories. Symlinks are not
// listed, since readdir only reports them as links, never as files.
async function indexServedFiles() {
  const files = new Map();

  for (const dir of servedDirs) {
    let entries;
    try {
      entries = await readdir(join(root, dir), {
        withFileTypes: true,
        recursive: true,
      });
    } catch {
      continue; // dist/ does not exist before the first build
    }

    for (const entry of entries) {
      if (entry.isFile()) {
        const file = join(entry.parentPath, entry.name);
        files.set("/" + relative(root, file).split(sep).join("/"), file);
      }
    }
  }

  return files;
}

let servedFiles = await indexServedFiles();

async function lookup(pathname) {
  let url;
  try {
    url = decodeURIComponent(pathname);
  } catch {
    return undefined; // malformed percent-encoding
  }
  if (url.endsWith("/")) {
    url += "index.html";
  }

  // A miss may just mean the file appeared after the last index, as
  // happens with a rebuild, so refresh once before giving up
  if (!servedFiles.has(url)) {
    servedFiles = await indexServedFiles();
  }

  return servedFiles.get(url);
}

const server = createServer(async (req, res) => {
  const file = await lookup(new URL(req.url, "http://localhost").pathname);

  if (!file) {
    res.writeHead(404).end("Not found");
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
