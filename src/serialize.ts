import { EncryptedData } from "./crypto";

const LENGTH_BYTES = 16; // 4x uint32

export function serialize({ ciphertext, iv, authTag, salt }: EncryptedData) {
  const lengths = [ciphertext, iv, authTag, salt].map((a) => a.length);

  const encodedLengths = Uint32Array.from(lengths);

  return new Blob([encodedLengths, ciphertext, iv, authTag, salt]);
}

export async function deserialize(blob: Blob): Promise<EncryptedData> {
  const encodedLengths = blob.slice(0, LENGTH_BYTES);

  const lengths = new Uint32Array(await encodedLengths.arrayBuffer());

  let data: Uint8Array<ArrayBuffer>[] = [];

  let offset = LENGTH_BYTES;
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
