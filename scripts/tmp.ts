import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { decryptData, deserialize } from "../src/crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const password = process.env.SECRET_PASSWORD || process.argv[3];

const encodedData = await readFile(path.resolve(__dirname, "../dist/data.bin"));

const decodedData = await deserialize(new Blob([encodedData.buffer]));

const decrypted = await decryptData(decodedData, password)
console.log("decrypted:", decrypted)