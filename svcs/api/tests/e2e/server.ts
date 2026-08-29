import type { AuthenticatedUser } from "../../src/types.ts";
import { createNewUServer } from "../../src/utils.ts";

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
const host = process.env.HOST ?? "0.0.0.0";
const server = createNewUServer({ authorize: authorizeLocalTestToken });

server.listen(port, host, () => {
  process.stdout.write(
    `common-utilities test api listening on http://${host}:${port}\n`,
  );
});

async function authorizeLocalTestToken(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const testToken = process.env.COMMON_UTILITIES_TEST_TOKEN ?? "test-token";
  const authorization = request.headers.get("authorization");
  const expectedAuthorization = `Bearer ${testToken}`;
  const hasTestToken = authorization === expectedAuthorization;

  if (!hasTestToken) {
    return null;
  }

  return { id: "1", login: "local-test" };
}
