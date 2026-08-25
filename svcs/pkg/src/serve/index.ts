import { createNewUServer } from "./utils.ts";

const port = Number(process.env.PORT ?? 3000);

createNewUServer().listen(port, "127.0.0.1", () => {
  process.stdout.write(`pkg REST server listening on 127.0.0.1:${port}\n`);
});
