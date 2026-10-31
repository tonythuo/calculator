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
  if (event.ctrlKey || event.metaKey || event.altKey) return; // leave browser shortcuts (zoom, etc.) alone
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

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return b;
  }
}

function chooseOperator(op) {
  // 1. If there's a pending operation, evaluate it first (chained ops)
  if (
    calcState.firstNumber !== null &&
    calcState.currentOperator !== null &&
    !calcState.shouldResetDisplay // a second number was entered since the operator
  ) {
    const result = calculate();
    if (result === null) return; // error path already showed it and reset state
    calcState.firstNumber = result;
    updateDisplay(result); // Show the intermediate result (e.g., 12 + 7 = 19)
  } else {
    calcState.firstNumber = parseFloat(calcState.displayValue);
  }

  // 2. Store the new operator and wait for the second number
  calcState.currentOperator = op;
  calcState.waitingForSecondNumber = true;
  calcState.shouldResetDisplay = true;
}

function calculate() {
  // Guard: Nothing to calculate if we don't have an operator
  if (calcState.firstNumber === null || calcState.currentOperator === null) {
    return parseFloat(calcState.displayValue);
  }

  const secondNumber = parseFloat(calcState.displayValue);
  
  let result;
  try {
    result = operate(calcState.currentOperator, calcState.firstNumber, secondNumber);
    result = roundResult(result); // shorten decimals so long results fit the display
  } catch (error) {
    // Pass the error to Karim's showError, then drop the pending operation
    showError(error.message);
    calcState.currentOperator = null;
    calcState.waitingForSecondNumber = false;
    calcState.shouldResetDisplay = true; // next digit starts fresh, clearing the error
    return null;
  }

  // Update state for potential chained operations
  calcState.firstNumber = result;
  calcState.displayValue = String(result); // keep state in sync with what's on screen
  calcState.currentOperator = null;
  calcState.waitingForSecondNumber = false;
  calcState.shouldResetDisplay = true;

  updateDisplay(result);
  return result;
}

function clearCalculator() {
  calcState.firstNumber = null;
  calcState.currentOperator = null;
  calcState.displayValue = "0";
  calcState.waitingForSecondNumber = false;
  calcState.shouldResetDisplay = false;
  
  updateDisplay("0");
}

// Output (Karim): updateDisplay, showError, roundResult
const displayEl = document.getElementById("display");

function updateDisplay(value) {
  displayEl.textContent = String(value); // handles both number and string input
  displayEl.classList.remove("error");
}

function showError(message) {
  // Display-only: never touch calcState — calculate()'s error path owns error recovery
  updateDisplay(message);
  displayEl.classList.add("error");
}

function roundResult(number) {
  // Past ~1e13, x*100 loses precision and fabricates digits — pass big numbers through
  if (Math.abs(number) < 1e13) {
    return Math.round(number * 100) / 100; // 2 decimals keeps long results short
  }
  return number;
}
