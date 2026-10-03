const fs = require("fs");
const p =
  "node_modules/.pnpm/@opennextjs+cloudflare@1.20_a1bdf4975144b7ff7d652b6f60155ca8/node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js";
let c = fs.readFileSync(p, "utf8");
if (c.includes("materialize-opennext-symlinks.ps1")) {
  console.log("already patched");
  process.exit(0);
}
if (!c.includes("spawnSync")) {
  c = c.replace(
    'import fs from "node:fs";',
    'import fs from "node:fs";\nimport { spawnSync } from "node:child_process";',
  );
}
const needle = "Bundling the OpenNext server";
const i = c.indexOf(needle);
if (i < 0) throw new Error("needle not found");
const start = c.lastIndexOf("console.log", i);
const inject = [
  'if (process.platform === "win32") {',
  '        const ps1 = path.join(appPath, "scripts", "materialize-opennext-symlinks.ps1");',
  "        if (fs.existsSync(ps1)) {",
  '            console.log("[win32] materializing OpenNext symlinks before esbuild...");',
  '            spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1], { cwd: appPath, stdio: "inherit" });',
  "        }",
  "    }",
  "    ",
].join("\n");
c = c.slice(0, start) + inject + c.slice(start);
fs.writeFileSync(p, c);
console.log("patched ok");
