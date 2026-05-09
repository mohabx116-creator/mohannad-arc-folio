import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(rootDir, "dist", "client");
const args = process.argv.slice(2);
const portArg = args.find((arg, index) => args[index - 1] === "--port");
const hostArg = args.find((arg, index) => args[index - 1] === "--host");
const port = Number(process.env.PORT ?? portArg ?? 4173);
const host = hostArg ?? "127.0.0.1";

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".pdf", "application/pdf"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

async function resolveFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const relativePath = cleanPath.replace(/^\/+/, "");
  const directPath = path.resolve(clientDir, relativePath);

  if (!directPath.startsWith(clientDir)) {
    return path.join(clientDir, "index.html");
  }

  try {
    const directStat = await stat(directPath);
    if (directStat.isFile()) return directPath;
    if (directStat.isDirectory()) {
      const indexPath = path.join(directPath, "index.html");
      if ((await stat(indexPath)).isFile()) return indexPath;
    }
  } catch {
    // Fall through to the SPA fallback below.
  }

  return path.join(clientDir, "index.html");
}

createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url ?? "/");
    const contentType =
      mimeTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
    response.writeHead(200, { "content-type": contentType });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Static preview error");
  }
}).listen(port, host, () => {
  console.log(`Static preview: http://${host}:${port}`);
});
