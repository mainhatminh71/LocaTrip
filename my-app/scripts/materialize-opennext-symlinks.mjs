import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

function walk(dir, out) {
  out = out || [];
  let names;
  try { names = fs.readdirSync(dir); } catch { return out; }
  for (const name of names) {
    const full = path.join(dir, name);
    let st;
    try { st = fs.lstatSync(full); } catch { continue; }
    if (st.isSymbolicLink()) { out.push(full); continue; }
    if (st.isDirectory()) walk(full, out);
  }
  return out;
}

function materializeOne(linkPath) {
  let target;
  try { target = fs.readlinkSync(linkPath); } catch { return false; }
  const absTarget = path.isAbsolute(target) ? target : path.resolve(path.dirname(linkPath), target);
  if (!fs.existsSync(absTarget)) return false;
  spawnSync("cmd", ["/c", "rmdir", linkPath], { stdio: "ignore" });
  if (fs.existsSync(linkPath)) {
    try { fs.unlinkSync(linkPath); } catch {
      try { fs.rmSync(linkPath, { force: true, recursive: true }); } catch { return false; }
    }
  }
  fs.mkdirSync(linkPath, { recursive: true });
  const r = spawnSync("robocopy", [absTarget, linkPath, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/nc", "/ns", "/np"], { stdio: "ignore" });
  return (r.status == null ? 1 : r.status) < 8;
}

export function materializeOpenNextSymlinks(appRoot = process.cwd()) {
  const root = path.join(appRoot, ".open-next", "server-functions");
  if (!fs.existsSync(root)) return 0;
  let fixed = 0;
  for (const fn of fs.readdirSync(root)) {
    const nm = path.join(root, fn, "node_modules");
    if (!fs.existsSync(nm)) continue;
    const links = walk(nm).sort((a, b) => b.length - a.length);
    for (const link of links) {
      if (materializeOne(link)) fixed += 1;
    }
  }
  if (fixed > 0) console.log("[materialize-opennext-symlinks] replaced " + fixed + " symlink(s)");
  return fixed;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) materializeOpenNextSymlinks();
