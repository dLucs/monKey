import { words as INITIAL_WORDS } from "./data.js";

const $time = document.querySelector("time");
const $paragraph = document.querySelector("p");
const $input = document.querySelector("input");
const $results = document.getElementById("results");
const $wpm = document.getElementById("wpm");
const $accuracy = document.getElementById("accuracy");
const $game = document.getElementById("game");
const $reload = document.querySelector("button");

const INITIAL_TIME = 30;

let words = [];
let currentTime = INITIAL_TIME;

function initGame() {
  $game.style.display = "flex";
  $results.style.display = "none";
  words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, 48);
  currentTime = INITIAL_TIME;
  $time.textContent = currentTime;
  $paragraph.innerHTML = words
    .map((word, index) => {
      const letters = word.split("");
      return `<x-word>${letters
        .map((letter) => `<x-letter>${letter}</x-letter>`)
        .join("")}</x-word>`;
    })
    .join(" ");
  //select first word and letter
  const $firstWord = $paragraph.querySelector("x-word");
  $firstWord.classList.add("active");
  $firstWord.querySelector("x-letter").classList.add("active");

  const intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;

    if (currentTime == 0) {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

function initEvents() {
  //Keyboard events
  document.addEventListener("keydown", () => {
    $input.focus();
  });
  $input.addEventListener("keydown", onKeyDown);
  $input.addEventListener("keyup", onKeyUp);
  $reload.addEventListener("click", initGame);
}

function onKeyDown(event) {
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("x-letter.active");

  //Move to next word in when space key is pushed
  const { key } = event;
  if (key == " ") {
    event.preventDefault();

    const $nextWord = $currentWord.nextElementSibling;
    const $nextLetter = $nextWord.querySelector("x-letter");
    $currentWord.classList.remove("active", "marked");
    $currentLetter.classList.remove("active");

    $nextWord.classList.add("active");
    $nextLetter.classList.add("active");

    $input.value = "";

    //Check if word has been completed
    const wordIncomplete =
      $currentWord.querySelectorAll("x-letter:not(.correct)").length > 0;

    wordIncomplete
      ? $currentWord.classList.add("incomplete")
      : $currentWord.classList.add("correct");
    return;
  }

  //Move to previous word in when return is pushed
  if (key == "Backspace") {
    const $prevWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter.previousElementSibling;

    if (!$prevWord && !prevLetter) {
      event.preventDefault();
      return;
    }
    const $wordIncomplete = $paragraph.querySelector("x-word.incomplete");
    if ($wordIncomplete && !$prevLetter) {
      event.preventDefault();
      $prevWord.classList.remove("incomplete");
      $prevWord.classList.add("active");

      const $letterToGo = $prevWord.querySelector("x-letter:last-child");

      $currentLetter.classList.remove("active");
      $letterToGo.classList.add("active");

      $input.value = [
        ...$prevWord.querySelectorAll("x-letter.correct, x-letter.incorrect"),
      ]
        .map(($el) => {
          return $el.classList.contains("correct") ? $el.innerText : "*";
        })
        .join("");
    }
  }
}
function onKeyUp() {
  // Get current elements
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("x-letter.active");

  // Limit input to word size
  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;

  // Check letters
  const $allLetters = $currentWord.querySelectorAll("x-letter");

  $allLetters.forEach(($letter) =>
    $letter.classList.remove("correct", "incorrect")
  );

  const inputChars = $input.value.split("");
  const minLength = Math.min(inputChars.length, $allLetters.length);

  for (let index = 0; index < minLength; index++) {
    const char = inputChars[index];
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];
    const isCorrect = char === letterToCheck;
    const letterColor = isCorrect ? "correct" : "incorrect";
    $letter.classList.add(letterColor);
  }

  // Move cursor to end of word
  $currentLetter.classList.remove("active", "previously-active");
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];
  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    $currentLetter.classList.add("active", "previously-active");
  }
}

function gameOver() {
  $game.style.display = "none";
  $results.style.display = "flex";

  const correctWords = $paragraph.querySelectorAll("x-word.correct").length;
  const correctLetter = $paragraph.querySelectorAll("x-letter.correct").length;
  const incorrectLetter =
    $paragraph.querySelectorAll("x-letter.incorrect").length;
  const totalLetters = correctLetter + incorrectLetter;
  const accuracy = totalLetters > 0 ? (correctLetter / totalLetters) * 100 : 0;

  const wpm = (correctWords * 60) / INITIAL_TIME;
  $wpm.textContent = wpm;
  $accuracy.textContent = `${accuracy.toFixed(2)}%`;
}

initGame();
initEvents();
