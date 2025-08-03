import { mkdir, writeFile } from "fs/promises";
import { encryptData, serialize } from "../src/crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretData = process.env.SECRET_DATA || process.argv[2];
const password = process.env.SECRET_PASSWORD || process.argv[3];

if (!secretData) {
  throw new Error(
    "missing secret data, set SECRET_DATA env var, or provide as the first command line argument"
  );
}

if (!password) {
  throw new Error(
    "missing password, set SECRET_PASSWORD env var, or provide as the second command line argument"
  );
}

const result = await encryptData(secretData, password);
const serializedData = serialize(result);

await mkdir(path.resolve(__dirname, "../dist"), { recursive: true });

await writeFile(
  path.resolve(__dirname, "../dist/data.bin"),
  new DataView(await serializedData.arrayBuffer())
);
