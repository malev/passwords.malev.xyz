import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import words from "./words.json" assert { type: "json" };

function generatePassword(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

function generateMemorablePassword(dashes = false) {
  const specialChars = dashes ? "-" : "!@#$%^&*";
  const randomWord = () => words[Math.floor(Math.random() * words.length)];
  const randomSpecialChar = () =>
    specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomNumber = () => Math.floor(Math.random() * 10);

  const password = `${randomWord()}${randomSpecialChar()}${randomWord()}${randomNumber()}${randomWord()}`;
  return password;
}

function generateApiKey(length = 32) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function generateUUID() {
  return window.crypto.randomUUID();
}

function generatePasswords() {
  const passwords = [];
  passwords.push(generatePassword(16));
  passwords.push(generateMemorablePassword(true));
  passwords.push(generateMemorablePassword());
  passwords.push(generateUUID());
  passwords.push(generateApiKey(32));

  document.querySelector("#passwords").innerHTML = passwords
    .map((password) => `<li>${password}</li>`)
    .join("");
}

function setupPassword(button) {
  button.addEventListener("click", generatePasswords);
  generatePasswords();
}

document.querySelector("#generator").innerHTML = `
<article id="lol">
  <p>Select and copy a password. If you need a new one, just click on Generate.</p>
  <div class="card">
    <ul id="passwords"></ul>
  </div>
  <hr />
  <div class="card">
    <button id="generate" type="button">Generate</button>
  </div>

</article>
`;

setupPassword(document.querySelector("#generate"));

const firebaseConfig = {
  apiKey: "AIzaSyBrnb6J9kQeKDTgaycuRkohDQb-kjYFmMw",
  authDomain: "passwords-malev-xyz.firebaseapp.com",
  projectId: "passwords-malev-xyz",
  storageBucket: "passwords-malev-xyz.appspot.com",
  messagingSenderId: "307008882560",
  appId: "1:307008882560:web:98b2f32c0efb1249f9e365",
  measurementId: "G-PVL440BDPW",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
