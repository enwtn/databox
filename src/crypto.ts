async function decrypt(data: BufferSource, key: CryptoKey, iv: BufferSource) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}
