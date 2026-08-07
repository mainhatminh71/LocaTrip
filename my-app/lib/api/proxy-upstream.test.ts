import assert from "node:assert/strict";
import {
  LOCALTRIP_LOCAL_API_DEFAULT,
  LOCALTRIP_PUBLIC_API_DEFAULT,
  resolveUpstreamBase,
} from "@/lib/api/proxy-upstream";

assert.equal(
  resolveUpstreamBase({}),
  LOCALTRIP_LOCAL_API_DEFAULT,
  "default → local",
);

assert.equal(
  resolveUpstreamBase({ LOCALTRIP_API_URL: "http://127.0.0.1:5000/" }),
  "http://127.0.0.1:5000",
  "explicit LOCALTRIP_API_URL",
);

assert.equal(
  resolveUpstreamBase({ LOCALTRIP_USE_PUBLIC_API: "true" }),
  LOCALTRIP_PUBLIC_API_DEFAULT,
  "toggle on → Railway default",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "1",
    LOCALTRIP_API_URL: "http://localhost:5000",
  }),
  LOCALTRIP_PUBLIC_API_DEFAULT,
  "toggle wins over LOCALTRIP_API_URL",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "yes",
    LOCALTRIP_PUBLIC_API_URL: "https://example.up.railway.app/",
  }),
  "https://example.up.railway.app",
  "custom public URL",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "false",
    LOCALTRIP_API_URL: "http://localhost:5000",
  }),
  "http://localhost:5000",
  "toggle off keeps explicit local URL",
);

console.log("proxy-upstream.test.ts: ok");
