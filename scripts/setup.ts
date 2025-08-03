import { mkdir, writeFile } from "fs/promises";
import { encryptData, serialize } from "../src/crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretData = process.env.SECRET_DATA;
const password = process.env.SECRET_PASSWORD;

if (!secretData) {
  throw new Error("missing secret data, set SECRET_DATA env var");
}

if (!password) {
  throw new Error("missing password, set SECRET_PASSWORD env var");
}

const result = await encryptData(secretData, password);
const serializedData = serialize(result);

await mkdir(path.resolve(__dirname, "../src/public"), { recursive: true });

await writeFile(
  path.resolve(__dirname, "../src/public/data.bin"),
  new DataView(await serializedData.arrayBuffer())
);
