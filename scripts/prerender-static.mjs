import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(rootDir, "dist", "client");
const serverEntryPath = path.join(rootDir, "dist", "server", "index.js");

const routes = ["/", "/portfolio", "/projects/al-se7r-tower", "/admin"];

const server = await import(pathToFileURL(serverEntryPath).href);
const handler = server.default;

if (!handler || typeof handler.fetch !== "function") {
  throw new Error("TanStack Start server entry did not expose a fetch handler.");
}

async function writeRoute(route) {
  const response = await handler.fetch(
    new Request(`https://mohannad-arc-folio.vercel.app${route}`),
    {},
    {},
  );

  if (!response.ok) {
    throw new Error(`Failed to prerender ${route}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const outputPath =
    route === "/" ? path.join(clientDir, "index.html") : path.join(clientDir, route, "index.html");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
  console.log(`prerendered ${route} -> ${path.relative(rootDir, outputPath)}`);
}

for (const route of routes) {
  await writeRoute(route);
}
