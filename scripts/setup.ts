import { writeFile } from "fs/promises";
import { encrypt } from "../src/crypto";
import { serialize } from "../src/serialize";
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

const result = await encrypt(secretData, password);
const serializedData = serialize(result);

const filePath = path.resolve(__dirname, "../public/data.bin");
await writeFile(filePath, new DataView(await serializedData.arrayBuffer()));

console.log(`wrote encrypted data to ${filePath}`);
