#!/usr/bin/env node

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error("Both operands must be finite numbers.");
  }
  if (b === 0) {
    throw new Error("Cannot calculate modulo by zero.");
  }
  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new Error("Both operands must be finite numbers.");
  }
  return base ** exponent;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error("The operand must be a finite number.");
  }
  if (n < 0) {
    throw new Error("Cannot calculate the square root of a negative number.");
  }
  return Math.sqrt(n);
}

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), and exponentiation (^).
function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be finite numbers.");
  }

  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "%":
      return modulo(left, right);
    case "^":
      return power(left, right);
    case "/":
      if (right === 0) {
        throw new Error("Cannot divide by zero.");
      }
      return left / right;
    default:
      throw new Error(`Unsupported operation: ${operator}`);
  }
}

function run() {
  const args = process.argv.slice(2);
  if (args[0] === "sqrt" && args.length === 2) {
    const input = args[1];
    if (input.trim() === "") {
      console.error("The operand must be a finite number.");
      process.exitCode = 1;
      return;
    }

    try {
      console.log(squareRoot(Number(input)));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
    return;
  }

  const [leftInput, operator, rightInput] = args;
  if (args.length !== 3) {
    console.error(
      "Usage: node src/calculator.js <number> <+|-|*|/|%|^> <number> | sqrt <number>",
    );
    process.exitCode = 1;
    return;
  }

  if (leftInput.trim() === "" || rightInput.trim() === "") {
    console.error("Both operands must be finite numbers.");
    process.exitCode = 1;
    return;
  }

  const left = Number(leftInput);
  const right = Number(rightInput);

  try {
    console.log(calculate(left, operator, right));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  run();
}

module.exports = { calculate, modulo, power, squareRoot };
