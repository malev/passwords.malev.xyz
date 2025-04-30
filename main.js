import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import words from "./words.json" assert { type: "json" };

const getRandomChar = (str) => {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str.charAt(randomIndex);
};

const shuffleString = (str) => {
  const array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array.join("");
};

function generatePassword(length) {
  if (length < 8) {
    throw new Error(
      "Password length must be at least 8 characters for security.",
    );
  }

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+=-`~[]{}|;':\",./<>?";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = "";


  // Ensure at least one character from each set
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  // Generate the remaining characters randomly
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(allChars);
  }

  // Shuffle the password to make the order less predictable
  password = shuffleString(password);

  return password;


  // const charset =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  // let password = "";
  // const array = new Uint8Array(length);
  // window.crypto.getRandomValues(array);
  // for (let i = 0; i < length; i++) {
  //   password += charset[array[i] % charset.length];
  // }
  // return password;
}

function generateMemorablePassword(wordCount = 3, includeSpecial = true, includeNumber = true, separator = "-") {
  const specialChars = "!@#$%^&*_+=-?";
  const numbers = "0123456789";
  const randomElement = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const passwordParts = [];

  for (let i = 0; i < wordCount; i++) {
    passwordParts.push(capitalizeFirstLetter(randomElement(words)));
    if (i < wordCount - 1) {
      if (includeSpecial && Math.random() < 0.5) {
        // Randomly include a special char
        passwordParts.push(randomElement(specialChars));
      } else if (includeNumber && Math.random() < 0.5) {
        // Randomly include a number
        passwordParts.push(randomElement(numbers));
      } else if (separator) {
        passwordParts.push(separator);
      }
    }
  }

  if (
    includeSpecial &&
    !passwordParts.some((part) => specialChars.includes(part))
  ) {
    passwordParts.splice(
      Math.floor(Math.random() * passwordParts.length),
      0,
      randomElement(specialChars),
    );
  }

  if (includeNumber && !passwordParts.some((part) => numbers.includes(part))) {
    passwordParts.splice(
      Math.floor(Math.random() * passwordParts.length),
      0,
      randomElement(numbers),
    );
  }

  return passwordParts.join("");
}

function generateApiKey(length = 32) {
  if (length <= 0) {
    throw new Error("API key length must be greater than zero.");
  }

  const randomBytes = new Uint8Array(Math.ceil(length / 2));
  window.crypto.getRandomValues(randomBytes);

  // Convert the buffer to a hexadecimal string
  let apiKey = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  // Ensure the API key is exactly the desired length
  if (apiKey.length > length) {
    apiKey = apiKey.slice(0, length);
  }

  return apiKey;



  // const array = new Uint8Array(length);
  // window.crypto.getRandomValues(array);
  // return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
  //   "",
  // );
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
