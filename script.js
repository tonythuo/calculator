// Shared state (Interface Contract — defined here once, all branches use it)
const calcState = {
  firstNumber: null,
  currentOperator: null,
  displayValue: "0",
  waitingForSecondNumber: false,
  shouldResetDisplay: false
};

// Input (Tony): startFreshEntry, appendNumber, appendDecimal, backspace,
// handleKeyboard, setupButtons, handleButtonClick
function startFreshEntry(value) {
  calcState.displayValue = value;
  calcState.shouldResetDisplay = false;
}

function appendNumber(num) {
  if (calcState.shouldResetDisplay || calcState.displayValue === "0") {
    startFreshEntry(num);
  } else {
    calcState.displayValue += num;
  }
  updateDisplay(calcState.displayValue);
}

function appendDecimal() {
  if (calcState.shouldResetDisplay) {
    startFreshEntry("0.");
  } else if (!calcState.displayValue.includes(".")) {
    calcState.displayValue += ".";
  } else {
    return;
  }
  updateDisplay(calcState.displayValue);
}

function backspace() {
  if (calcState.shouldResetDisplay) {
    startFreshEntry("0");
  } else {
    calcState.displayValue = calcState.displayValue.slice(0, -1);
    if (calcState.displayValue === "") calcState.displayValue = "0";
  }
  updateDisplay(calcState.displayValue);
}

function handleKeyboard(event) {
  const key = event.key;
  if (key >= "0" && key <= "9") {
    appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Escape") {
    clearCalculator();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === ".") {
    appendDecimal();
  } else {
    return;
  }
  event.preventDefault();
}

function setupButtons() {
  document.querySelectorAll(".buttons button").forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
  document.addEventListener("keydown", handleKeyboard);
}

function handleButtonClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    appendNumber(button.dataset.number);
  } else if (button.dataset.operator !== undefined) {
    chooseOperator(button.dataset.operator);
  } else if (button.id === "equals") {
    calculate();
  } else if (button.id === "clear") {
    clearCalculator();
  } else if (button.id === "decimal") {
    appendDecimal();
  } else if (button.id === "backspace") {
    backspace();
  }
}

setupButtons();

// Logic (Lefa): add, subtract, multiply, divide, operate,
// chooseOperator, calculate, clearCalculator
function add(a, b) { }
function subtract(a, b) { }
function multiply(a, b) { }
function divide(a, b) { }
function operate(op, a, b) { }
function chooseOperator(op) { }
function calculate() { }
function clearCalculator() { }

// Output (Karim): updateDisplay, showError, roundResult
function updateDisplay(value) { }
function showError(message) { }
function roundResult(number) { }
