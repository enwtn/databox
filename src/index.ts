import { decrypt } from "./crypto.js";
import { deserialize } from "./serialize.js";

const form = document.getElementById("password-form")!;
const passwordInput = document.getElementById("password") as HTMLInputElement;

const serializedData = await (await fetch("/data.bin")).blob();
const encryptedData = await deserialize(serializedData);

function displayData(data: string) {
  const container = document.getElementById("content-container")!;

  const dataContainer = document.createElement("pre");
  dataContainer.textContent = data;

  container.replaceChildren(dataContainer);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = passwordInput.value;

  try {
    const decrypted = await decrypt(encryptedData, password);
    displayData(decrypted);
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;

    alert("incorrect password, try again");
  }
});
