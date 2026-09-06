import assert from "node:assert/strict";
import {
  LOCALTRIP_LOCAL_API_DEFAULT,
  LOCALTRIP_PAYMENT_SERVICE_DEFAULT,
  LOCALTRIP_PUBLIC_API_DEFAULT,
  LOCALTRIP_TRIP_SERVICE_DEFAULT,
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
  LOCALTRIP_TRIP_SERVICE_DEFAULT,
  "toggle on → trip service default",
);

assert.equal(
  resolveUpstreamBase({ LOCALTRIP_USE_PUBLIC_API: "true" }, "payment"),
  LOCALTRIP_PAYMENT_SERVICE_DEFAULT,
  "toggle on + payment → payment service default",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "1",
    LOCALTRIP_API_URL: "http://localhost:5000",
  }),
  LOCALTRIP_TRIP_SERVICE_DEFAULT,
  "toggle wins over LOCALTRIP_API_URL",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "yes",
    LOCALTRIP_PUBLIC_API_URL: "https://example.up.railway.app/",
  }),
  "https://example.up.railway.app",
  "custom public gateway URL (≠ dead default)",
);

assert.equal(
  resolveUpstreamBase(
    {
      LOCALTRIP_USE_PUBLIC_API: "yes",
      LOCALTRIP_PUBLIC_API_URL: "https://example.up.railway.app/",
    },
    "payment",
  ),
  "https://example.up.railway.app",
  "custom gateway used for payment too",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "true",
    LOCALTRIP_PUBLIC_API_URL: LOCALTRIP_PUBLIC_API_DEFAULT,
  }),
  LOCALTRIP_TRIP_SERVICE_DEFAULT,
  "legacy dead gateway URL ignored → per-service trip",
);

assert.equal(
  resolveUpstreamBase(
    {
      LOCALTRIP_USE_PUBLIC_API: "true",
      LOCALTRIP_TRIP_SERVICE_URL: "https://custom-trip.example/",
      LOCALTRIP_PAYMENT_SERVICE_URL: "https://custom-pay.example/",
    },
    "trip",
  ),
  "https://custom-trip.example",
  "custom trip service URL",
);

assert.equal(
  resolveUpstreamBase(
    {
      LOCALTRIP_USE_PUBLIC_API: "true",
      LOCALTRIP_TRIP_SERVICE_URL: "https://custom-trip.example/",
      LOCALTRIP_PAYMENT_SERVICE_URL: "https://custom-pay.example/",
    },
    "payment",
  ),
  "https://custom-pay.example",
  "custom payment service URL",
);

assert.equal(
  resolveUpstreamBase({
    LOCALTRIP_USE_PUBLIC_API: "false",
    LOCALTRIP_API_URL: "http://localhost:5000",
  }),
  "http://localhost:5000",
  "toggle off keeps explicit local URL",
);

assert.equal(
  resolveUpstreamBase(
    {
      LOCALTRIP_USE_PUBLIC_API: "false",
      LOCALTRIP_API_URL: "http://localhost",
    },
    "payment",
  ),
  "http://localhost",
  "local mode payment uses same gateway",
);

console.log("proxy-upstream.test.ts: ok");
