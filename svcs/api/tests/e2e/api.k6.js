import { check, sleep } from "k6";
import http from "k6/http";

const apiUrl = __ENV.API_URL || "http://api:8787";
const apiToken = __ENV.API_TOKEN || "test-token";
const duration = __ENV.K6_DURATION || "5s";
const vus = Number(__ENV.K6_VUS || "1");

http.setResponseCallback(http.expectedStatuses({ max: 399, min: 200 }, 401));

export const options = {
  duration,
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
  vus,
};

export default function apiContract() {
  const alive = http.get(`${apiUrl}/api/v1/alive`);

  check(alive, {
    "alive returns 200": (response) => response.status === 200,
  });

  const unauthorized = http.get(`${apiUrl}/api/v1/packages?kind=util&q=head`);

  check(unauthorized, {
    "packages require auth": (response) => response.status === 401,
  });

  const params = {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };
  const packages = http.get(`${apiUrl}/api/v1/packages?kind=util&q=head`, params);
  const detail = http.get(`${apiUrl}/api/v1/packages/util/arr/head`, params);

  check(packages, {
    "packages return 200": (response) => response.status === 200,
    "packages include cache status": (response) => {
      const cache = response.headers["X-Cache"];
      const isMiss = cache === "MISS";
      const isHit = cache === "HIT";
      const hasCacheStatus = isMiss || isHit;

      return hasCacheStatus;
    },
  });

  check(detail, {
    "detail returns 200": (response) => response.status === 200,
    "detail includes source code": (response) => {
      const hasCodeBlocks = response.body.includes("codeBlocks");

      return hasCodeBlocks;
    },
  });

  sleep(1);
}
