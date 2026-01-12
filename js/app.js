const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect, so keep coding every day.",
  "JavaScript is fun when you understand it well.",
  "Typing fast requires focus and lots of practice.",
  "Build small projects to master new concepts quickly.",
  "Consistency is key to improving any skill.",
  "A journey of a thousand miles begins with a single step.",
  "Errors are opportunities to learn and grow.",
  "Always write clean code for easier maintenance.",
  "Believe in yourself and never give up."
];

const inputEl = document.querySelector(".input-box");
const sentence = document.querySelector(".sentence");
const startBtn = document.querySelector("#start");
const nextBtn = document.querySelector("#next");
const accuracyText = document.querySelector("#accuracy");
const wpmText = document.querySelector("#wpm");
const timeEl = document.querySelector("#time");

const INITIAL_TIME = 60;

const state = {
  currentSentence: sentences[0],
  timeLeft: INITIAL_TIME,
  totalTyped: 0,
  correctTyped: 0,
  wpm: 0,
  accuracy: 100
};

const prevIndexes = [];
let timerId = null;

resetUI();

inputEl.addEventListener("input", function () {
  const typedText = inputEl.value;
  const targetText = state.currentSentence;

  const result = calculateAccuracy(typedText, targetText);
  const timeSpent = INITIAL_TIME - state.timeLeft;

  state.wpm = calculateWPM(state.correctTyped + result.correct, timeSpent);
  state.accuracy =
    state.totalTyped + result.total === 0
      ? 100
      : Math.round(
          ((state.correctTyped + result.correct) /
            (state.totalTyped + result.total)) *
            100
        );

  wpmText.textContent = state.wpm;
  accuracyText.textContent = state.accuracy;
});

inputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const typedText = inputEl.value.trim();
    const targetText = state.currentSentence;

    const result = calculateAccuracy(typedText, targetText);
    state.correctTyped += result.correct;
    state.totalTyped += result.total;

    inputEl.value = "";
    changeSentence();
  }
});

startBtn.addEventListener("click", function () {
  startBtn.disabled = true;
  nextBtn.disabled = false;
  inputEl.disabled = false;
  inputEl.focus();
  startTimer();
});

nextBtn.addEventListener("click", function () {
  const typedText = inputEl.value.trim();
  const targetText = state.currentSentence;

  const result = calculateAccuracy(typedText, targetText);
  state.correctTyped += result.correct;
  state.totalTyped += result.total;

  inputEl.value = "";
  changeSentence();
});

function startTimer() {
  if (timerId) return;

  timerId = setInterval(() => {
    if (state.timeLeft > 0) {
      state.timeLeft--;
      timeEl.textContent = state.timeLeft;
      updateStats();
    } else {
      clearInterval(timerId);
      timerId = null;
      updateStats();

      alert(
        `Time Up!\n\nWPM: ${state.wpm}\nAccuracy: ${state.accuracy}%`
      );

      resetState();
      resetUI();
    }
  }, 1000);
}

function updateStats() {
  const timeSpent = INITIAL_TIME - state.timeLeft;
  state.wpm = calculateWPM(state.correctTyped, timeSpent);
  state.accuracy =
    state.totalTyped === 0
      ? 100
      : Math.round((state.correctTyped / state.totalTyped) * 100);

  wpmText.textContent = state.wpm;
  accuracyText.textContent = state.accuracy;
}

function changeSentence() {
  if (prevIndexes.length === sentences.length) prevIndexes.length = 0;

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * sentences.length);
  } while (prevIndexes.includes(randomIndex));

  prevIndexes.push(randomIndex);
  state.currentSentence = sentences[randomIndex];
  sentence.textContent = state.currentSentence;
}

function resetState() {
  state.timeLeft = INITIAL_TIME;
  state.totalTyped = 0;
  state.correctTyped = 0;
  state.wpm = 0;
  state.accuracy = 100;
}

function resetUI() {
  inputEl.value = "";
  inputEl.disabled = true;
  startBtn.disabled = false;
  nextBtn.disabled = true;
  sentence.textContent = state.currentSentence;
  timeEl.textContent = state.timeLeft;
  wpmText.textContent = state.wpm;
  accuracyText.textContent = state.accuracy;
}

function calculateAccuracy(typed, target) {
  let correct = 0;
  const minLength = Math.min(typed.length, target.length);

  for (let i = 0; i < minLength; i++) {
    if (typed[i] === target[i]) correct++;
  }

  return {
    correct,
    total: typed.length
  };
}

function calculateWPM(correctChars, timeSpentInSeconds) {
  const minutes = timeSpentInSeconds / 60;
  if (minutes === 0) return 0;
  return Math.round((correctChars / 5) / minutes);
}
