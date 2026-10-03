/**
 * Cloudflare OpenNext build with Windows symlink materialization.
 * Re-runs materialize if the first esbuild pass still fails (installDeps may recreate links).
 */
import { spawnSync } from "node:child_process";
import { materializeOpenNextSymlinks } from "./materialize-opennext-symlinks.mjs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function runBuild() {
  return spawnSync(npm, ["run", "build:cf:raw"], {
    stdio: "inherit",
    env: { ...process.env, CI: "true" },
    shell: true,
  });
}

let result = runBuild();
if (result.status !== 0) {
  const n = materializeOpenNextSymlinks();
  if (n > 0) {
    console.log("[build-cf-win] retrying after materialize…");
    result = runBuild();
  }
}
process.exit(result.status ?? 1);
