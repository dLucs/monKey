const $time = document.querySelector("time");
const $paragraph = document.querySelector("p");
const $input = document.querySelector("input");

const INITIAL_TIME = 30;

const TEXT =
  "deep within the tangled foliage of the digital jungle there lived a curious monkey he was no ordinary simian he had an insatiable appetite for knowledge and an inexplicable fascination with keyboards one day while swinging from vine to vine he stumbled upon a mysterious clearing in its center stood a colossal keyboard its keys glistening like ripe bananas his eyes widened with wonder he couldn not resist with nimble fingers he began to type";

let words = [];
let currentTime = INITIAL_TIME;

function initGame() {
  words = TEXT.split(" ").slice(0, 32);
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
      console.log("game over");
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
  //get current elements
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("x-letter.active");

  //limit input to word size
  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;

  //Check letters
  const $allLetters = $currentWord.querySelectorAll("x-letter");

  $allLetters.forEach(($letter) =>
    $letter.classList.remove("correct", "incorrect")
  );

  $input.value.split("").forEach((char, index) => {
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];

    const isCorrect = char == letterToCheck;

    const letterColor = isCorrect ? "correct" : "incorrect";
    $letter.classList.add(letterColor);
  });

  //move cursor to end of word
  $currentLetter.classList.remove("active", "previously-active");
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];
  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    $currentLetter.classList.add("active", "previously-active");
  }
}

function gameOver() {}

initGame();
initEvents();
