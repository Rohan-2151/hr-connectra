import { build } from "vite";
import { execSync } from "node:child_process";

async function run() {
  console.log("building client...");
  await build();

  console.log("building server...");
  execSync("tsc -p tsconfig.server.json", { stdio: "inherit" });
}

run();
