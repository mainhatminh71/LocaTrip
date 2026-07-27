import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const src = path.join(root, "locatrip-scrape");
const dest = path.join(root, "my-app", "public", "scrape");

execSync(`robocopy "${src}" "${dest}" /E /NFL /NDL /NJH /NJS /nc /ns /np`, {
  stdio: "inherit",
  shell: true,
});
console.log(`[sync] ${src} → ${dest}`);
