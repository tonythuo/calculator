// tests.js — console test suite for the calculator.
// Auto-runs on page load; open DevTools → Console to see results.
(function () {
  "use strict";

  let passed = 0;
  let failed = 0;

  function assert(name, actual, expected) {
    if (actual === expected) {
      passed++;
    } else {
      failed++;
      console.error(`❌ ${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  function assertThrows(name, fn, message) {
    try {
      fn();
      failed++;
      console.error(`❌ ${name}: expected throw "${message}", nothing thrown`);
    } catch (error) {
      assert(name, error.message, message);
    }
  }

  function reset() {
    clearCalculator();
  }

  function displayText() {
    return document.getElementById("display").textContent;
  }

  function hasErrorClass() {
    return document.getElementById("display").classList.contains("error");
  }

  // --- Logic: pure math ---
  reset();
  assert("add(5, 3)", add(5, 3), 8);
  assert("subtract(10, 4)", subtract(10, 4), 6);
  assert("multiply(6, 7)", multiply(6, 7), 42);
  assert("divide(10, 4)", divide(10, 4), 2.5);
  assertThrows("divide(5, 0)", () => divide(5, 0), "Cannot divide by zero");
  assert('operate("+", 5, 3)', operate("+", 5, 3), 8);
  assert('operate("/", 21, 3)', operate("/", 21, 3), 7);
  assert("operate unknown returns b", operate("%", 5, 3), 3);

  // --- Output: display functions ---
  reset();
  updateDisplay("42");
  assert("updateDisplay string", displayText(), "42");
  updateDisplay(7);
  assert("updateDisplay number", displayText(), "7");

  reset();
  assert("roundResult(3.14159)", roundResult(3.14159), 3.14);
  assert("roundResult(2)", roundResult(2), 2);
  assert("roundResult(1/3)", roundResult(1 / 3), 0.33);
  assert("roundResult(1e21) unchanged", roundResult(1e21), 1e21);
  assert("roundResult(Infinity) stays Infinity", roundResult(Infinity), Infinity);

  reset();
  showError("boom");
  assert("showError text", displayText(), "boom");
  assert("showError class", hasErrorClass(), true);
  updateDisplay("9");
  assert("updateDisplay clears error class", hasErrorClass(), false);

  // --- Input/state flows ---
  reset();
  appendNumber("1");
  appendNumber("2");
  assert("digits build 12", calcState.displayValue, "12");
  appendDecimal();
  appendDecimal();
  assert("only one decimal", calcState.displayValue, "12.");
  backspace();
  assert("backspace removes last char", calcState.displayValue, "12");
  backspace();
  assert("backspace again", calcState.displayValue, "1");

  reset();
  appendNumber("0");
  appendNumber("5");
  assert("leading zero ignored", calcState.displayValue, "5");

  reset();
  appendNumber("3");
  appendDecimal();
  appendNumber("5");
  appendDecimal();
  assert("decimal mid-number not repeated", calcState.displayValue, "3.5");

  reset();
  appendNumber("5");
  assert("equals with no operator returns display", calculate(), 5);

  // --- Chained operations (12 + 7 - 5 = 14) ---
  reset();
  appendNumber("1");
  appendNumber("2");
  chooseOperator("+");
  appendNumber("7");
  chooseOperator("-");
  assert("chained intermediate 19", calcState.firstNumber, 19);
  appendNumber("5");
  assert("chained result 12 + 7 - 5 = 14", calculate(), 14);

  // --- Equals then continue (12 + 7 = 19, then + 3 = 22) ---
  reset();
  appendNumber("1");
  appendNumber("2");
  chooseOperator("+");
  appendNumber("7");
  calculate();
  assert("equals shows intermediate", displayText(), "19");
  chooseOperator("+");
  appendNumber("3");
  assert("continue after equals 22", calculate(), 22);
  assert("continue after equals display", displayText(), "22");

  // --- Operator pressed twice in a row ---
  reset();
  appendNumber("1");
  appendNumber("2");
  chooseOperator("+");
  chooseOperator("-");
  assert("operator twice keeps firstNumber", calcState.firstNumber, 12);
  assert("operator twice keeps latest operator", calcState.currentOperator, "-");

  // --- Divide by zero end-to-end + error recovery ---
  reset();
  appendNumber("5");
  chooseOperator("/");
  appendNumber("0");
  calculate();
  assert("divide by zero message", displayText(), "Cannot divide by zero");
  assert("divide by zero error class", hasErrorClass(), true);
  assert("divide by zero clears operator", calcState.currentOperator, null);
  appendNumber("7");
  assert("error clears on next digit", displayText(), "7");
  assert("error class cleared", hasErrorClass(), false);

  // --- Clear resets everything ---
  reset();
  appendNumber("9");
  chooseOperator("+");
  clearCalculator();
  assert("clear display value", calcState.displayValue, "0");
  assert("clear firstNumber", calcState.firstNumber, null);
  assert("clear operator", calcState.currentOperator, null);
  assert("clear waiting flag", calcState.waitingForSecondNumber, false);
  assert("clear reset flag", calcState.shouldResetDisplay, false);
  assert("clear shows 0", displayText(), "0");

  // --- Keyboard routing ---
  reset();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "8" }));
  assert("keyboard digit", calcState.displayValue, "8");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "+" }));
  assert("keyboard operator", calcState.currentOperator, "+");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  assert("keyboard clear", calcState.displayValue, "0");

  reset();
  appendNumber("5");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "0", ctrlKey: true }));
  assert("ctrl+digit left for the browser", calcState.displayValue, "5");

  console.log(`\n✅ ${passed} passed, ❌ ${failed} failed`);
  globalThis.__TESTS__ = { passed, failed };
  reset(); // leave the calculator clean
})();
