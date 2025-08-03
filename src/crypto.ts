// heavily inspired by https://medium.com/@thomas_40553/how-to-secure-encrypt-and-decrypt-data-within-the-browser-with-aes-gcm-and-pbkdf2-057b839c96b6

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>) {
  const encodedPassword = encoder.encode(password);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encodedPassword,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return derivedKey;
}

export async function encryptData(data: string, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM
  const key = await deriveKey(password, salt);
  const encodedData = encoder.encode(data);

  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128, // 128-bit tag length
    },
    key,
    encodedData
  );

  // extract the ciphertext and authentication tag
  const ciphertext = encryptedContent.slice(
    0,
    encryptedContent.byteLength - 16
  );
  const authTag = encryptedContent.slice(encryptedContent.byteLength - 16);

  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
    authTag: new Uint8Array(authTag),
    salt,
  };
}

export async function decryptData(
  encryptedData: Awaited<ReturnType<typeof encryptData>>,
  password: string
) {
  const { ciphertext, iv, authTag, salt } = encryptedData;
  const key = await deriveKey(password, salt);

  // re-combine the ciphertext and the authentication tag
  const dataWithAuthTag = new Uint8Array(ciphertext.length + authTag.length);
  dataWithAuthTag.set(ciphertext, 0);
  dataWithAuthTag.set(authTag, ciphertext.length);

  const decryptedContent = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    dataWithAuthTag
  );

  return decoder.decode(decryptedContent);
}

export function serialize({
  ciphertext,
  iv,
  authTag,
  salt,
}: Awaited<ReturnType<typeof encryptData>>) {
  const lengths = [ciphertext, iv, authTag, salt].map((a) => a.length);

  const encodedLengths = new Uint8Array(Uint32Array.from(lengths).buffer);

  return new Blob([encodedLengths, ciphertext, iv, authTag, salt]);
}

export async function deserialize(blob: Blob) {
  const encodedLengths = blob.slice(0, 4 * 4); // 4x uint32

  const lengths = new Uint32Array(await encodedLengths.arrayBuffer());

  let data: Uint8Array<ArrayBuffer>[] = [];

  let offset = 4 * 4;
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i];

    data[i] = new Uint8Array(
      await blob.slice(offset, offset + length).arrayBuffer()
    );

    offset += length;
  }

  const [ciphertext, iv, authTag, salt] = data;

  return { ciphertext, iv, authTag, salt };
}
