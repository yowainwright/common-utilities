import { createNewUServer } from "./utils.ts";

const port = process.env.PORT ? Number(process.env.PORT) : 0;
const host = process.env.HOST ?? "127.0.0.1";
const server = createNewUServer();

server.listen(port, host, () => {
  const address = server.address();
  const hasAddress = address !== null;
  const isTcpAddress = typeof address === "object";
  const shouldReadPort = isTcpAddress && hasAddress;
  let actualPort = port;

  if (shouldReadPort) {
    actualPort = address.port;
  }

  process.stdout.write(
    `common-utilities api listening on http://${host}:${actualPort}\n`,
  );
});
