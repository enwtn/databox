import { decryptData, deserialize } from "./crypto.js";

const form = document.getElementById("password-form")!;
const passwordInput = document.getElementById("password") as HTMLInputElement;

const serializedData = await (await fetch("./data.bin")).blob();
const encryptedData = await deserialize(serializedData);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = passwordInput.value;

  try {
    const decrypted = await decryptData(encryptedData, password);
    alert(decrypted);
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;

    alert("Incorrect Password");
  }
});

export {};
